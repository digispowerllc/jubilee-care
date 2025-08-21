// File: src/app/agent/profile/controllers/TabController.ts
import { Dispatch, SetStateAction } from "react";
import { TabType } from "../types";

export interface TabController {
  switchTab: (tab: TabType) => void;
}

export function createTabController(
  setActiveTab: Dispatch<SetStateAction<TabType>>
): TabController {
  return {
    switchTab: (tab: TabType) => {
      setActiveTab(tab);
    },
  };
}
