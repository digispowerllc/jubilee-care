// File: src/components/profile/tabs/TabController.ts
"use client";

import { useRouter } from "next/navigation";
import { ProfileControllerState, TabType } from "../../types";

export class TabController {
  state: ProfileControllerState;
  setState: (state: Partial<ProfileControllerState>) => void;
  router: ReturnType<typeof useRouter>;

  constructor(
    initialState: ProfileControllerState,
    setState: (state: Partial<ProfileControllerState>) => void,
    controller: TabController,
    router: ReturnType<typeof useRouter>
  ) {
    this.state = initialState;
    this.setState = setState;
    this.router = router;
  }

  switchTab = (tab: TabType) => {
    this.setState({ activeTab: tab });
    // optional: sync tab to URL so it survives refresh
    // this.router.push(`?tab=${tab}`);
  };

  // Security Tab Methods
  handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ isEditingPassword: false });
    // App Router has no reload, so simulate reload:
    this.router.refresh();
  };

  handlePINUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({
      isEditingPIN: false,
      pinVerified: true,
    });
    this.router.refresh();
  };

  openPasswordCard = () => {
    this.setState({
      isEditingPassword: true,
      isEditingPIN: false,
      newPIN: "",
      confirmPIN: "",
    });
  };

  openPINCard = () => {
    this.setState({
      isEditingPIN: true,
      isEditingPassword: false,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  toggle2FA = () => {
    this.setState({
      is2FAEnabled: !this.state.is2FAEnabled,
    });
  };
}

