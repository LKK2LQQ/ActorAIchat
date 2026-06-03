import { useEffect, useMemo, useRef, useState } from "react";
import { Path, SlotID } from "../constant";
import { IconButton } from "./button";
import { EmojiAvatar } from "./emoji";
import styles from "./new-chat.module.scss";

import LeftIcon from "../icons/left.svg";
import LightningIcon from "../icons/lightning.svg";
import EyeIcon from "../icons/eye.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { Mask, useMaskStore } from "../store/mask";
import Locale, { getLang } from "../locales";
import { useAppConfig, useChatStore } from "../store";
import { MaskAvatar } from "./mask";
import { useCommand } from "../command";
import { showConfirm } from "./ui-lib";
import { BUILTIN_MASKS, BUILTIN_MASK_STORE } from "../masks";
import clsx from "clsx";

function MaskItem(props: { mask: Mask; onClick?: () => void }) {
  return (
    <div className={styles["mask"]} onClick={props.onClick}>
      <MaskAvatar
        avatar={props.mask.avatar}
        model={props.mask.modelConfig.model}
      />
      <div className={clsx(styles["mask-name"], "one-line")}>
        {props.mask.name}
      </div>
    </div>
  );
}

function useMaskGroup(masks: Mask[]) {
  const [groups, setGroups] = useState<Mask[][]>([]);

  useEffect(() => {
    const computeGroup = () => {
      const appBody = document.getElementById(SlotID.AppBody);
      if (!appBody || masks.length === 0) return;

      const rect = appBody.getBoundingClientRect();
      const maxWidth = rect.width;
      const maxHeight = rect.height * 0.6;
      const maskItemWidth = 120;
      const maskItemHeight = 50;

      const rows = Math.ceil(maxHeight / maskItemHeight);
      const cols = Math.ceil(maxWidth / maskItemWidth);

      // Build positions sorted by distance from grid center (spiral outward)
      const centerRow = (rows - 1) / 2;
      const centerCol = (cols - 1) / 2;

      type Position = { r: number; c: number; dist: number };
      const positions: Position[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          positions.push({
            r,
            c,
            dist: Math.sqrt((r - centerRow) ** 2 + (c - centerCol) ** 2),
          });
        }
      }
      positions.sort((a, b) => a.dist - b.dist);

      // Fill grid center-first: most-used masks land closer to center
      const newGroups: Mask[][] = Array.from(
        { length: rows },
        () => new Array(cols),
      );
      let maskIndex = 0;
      for (const { r, c } of positions) {
        newGroups[r][c] = masks[maskIndex++ % masks.length];
      }

      setGroups(newGroups);
    };

    computeGroup();

    window.addEventListener("resize", computeGroup);
    return () => window.removeEventListener("resize", computeGroup);
  }, [masks]);

  return groups;
}

export function NewChat() {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();

  // Force re-render when agency agents JSON is loaded
  const [loaded, setLoaded] = useState(0);
  useEffect(() => {
    const handler = () => setLoaded((n) => n + 1);
    window.addEventListener("agency-agents-loaded", handler);
    return () => window.removeEventListener("agency-agents-loaded", handler);
  }, []);

  // Subscribe to store state with selectors so references are stable
  // (Zustand selectors use strict equality — only trigger re-render on actual change)
  const storeMasks = useMaskStore((s) => s.masks);
  const useCounts = useMaskStore((s) => s.useCounts);
  const hideBuiltinMasks = useAppConfig((s) => s.hideBuiltinMasks);
  const globalModelConfig = useAppConfig((s) => s.modelConfig);

  // Build allMasks from stable store subscriptions (not from getAll() which
  // always returns a fresh array and causes infinite render loops)
  const allMasks = useMemo(() => {
    const userMasks = Object.values(storeMasks).sort(
      (a, b) => b.createdAt - a.createdAt,
    );
    if (hideBuiltinMasks) return userMasks;
    const buildinMasks = BUILTIN_MASKS.map(
      (m) =>
        ({
          ...m,
          modelConfig: {
            ...globalModelConfig,
            ...m.modelConfig,
          },
        }) as Mask,
    );
    return userMasks.concat(buildinMasks);
  }, [storeMasks, hideBuiltinMasks, globalModelConfig, loaded]);

  // Filter masks by current UI language and sort by usage count (heat map)
  const masks = useMemo(() => {
    const langKey = getLang() === "cn" ? "zh" : "en";
    const filtered = allMasks.filter((m) => {
      const maskLang = (m as any).lang;
      if (!maskLang) return true; // user-created masks
      return maskLang === langKey;
    });
    // Sort by useCount descending — most-used masks land at center of spiral
    return [...filtered].sort(
      (a, b) => (useCounts[b.name] || 0) - (useCounts[a.name] || 0),
    );
  }, [allMasks, useCounts]);

  const groups = useMaskGroup(masks);

  const navigate = useNavigate();
  const config = useAppConfig();

  const maskRef = useRef<HTMLDivElement>(null);

  const { state } = useLocation();

  const startChat = (mask?: Mask) => {
    setTimeout(() => {
      chatStore.newSession(mask);
      navigate(Path.Chat);
    }, 10);
  };

  useCommand({
    mask: (id) => {
      try {
        const mask = maskStore.get(id) ?? BUILTIN_MASK_STORE.get(id);
        startChat(mask ?? undefined);
      } catch {
        console.error("[New Chat] failed to create chat from mask id=", id);
      }
    },
  });

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.scrollLeft =
        (maskRef.current.scrollWidth - maskRef.current.clientWidth) / 2;
    }
  }, [groups]);

  return (
    <div className={styles["new-chat"]}>
      <div className={styles["mask-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.NewChat.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
        {!state?.fromHome && (
          <IconButton
            text={Locale.NewChat.NotShow}
            onClick={async () => {
              if (await showConfirm(Locale.NewChat.ConfirmNoShow)) {
                startChat();
                config.update(
                  (config) => (config.dontShowMaskSplashScreen = true),
                );
              }
            }}
          ></IconButton>
        )}
      </div>
      <div className={styles["mask-cards"]}>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f606" size={24} />
        </div>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f916" size={24} />
        </div>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f479" size={24} />
        </div>
      </div>

      <div className={styles["title"]}>{Locale.NewChat.Title}</div>
      <div className={styles["sub-title"]}>{Locale.NewChat.SubTitle}</div>

      <div className={styles["actions"]}>
        <IconButton
          text={Locale.NewChat.More}
          onClick={() => navigate(Path.Masks)}
          icon={<EyeIcon />}
          bordered
          shadow
        />

        <IconButton
          text={Locale.NewChat.Skip}
          onClick={() => startChat()}
          icon={<LightningIcon />}
          type="primary"
          shadow
          className={styles["skip"]}
        />
      </div>

      <div className={styles["masks"]} ref={maskRef}>
        {groups.map((masks, i) => (
          <div key={i} className={styles["mask-row"]}>
            {masks.map((mask, index) => (
              <MaskItem
                key={index}
                mask={mask}
                onClick={() => startChat(mask)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
