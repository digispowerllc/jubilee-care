// File: src/app/agent/profile/components/tabs/TabController.ts
import { ProfileControllerState, TabType } from "../../types";
import { useRouter } from "next/navigation";

export class TabController {
  state: ProfileControllerState;
  setState: (state: Partial<ProfileControllerState>) => void;
  router: ReturnType<typeof useRouter>; // ✅ Correct type

  constructor(
    initialState: ProfileControllerState,
    setState: (state: Partial<ProfileControllerState>) => void,
    _controller: TabController,
    router: ReturnType<typeof useRouter> // ✅ Fix here
  ) {
    this.state = initialState;
    this.setState = setState;
    this.router = router;
  }

  switchTab = (tab: TabType) => {
    this.setState({ activeTab: tab });
  };

  // Security Tab Methods
  handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ isEditingPassword: false });
    this.router.refresh(); // ✅ use refresh in App Router instead of reload
  };

  handlePINUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({
      isEditingPIN: false,
      pinVerified: true,
    });
    this.router.refresh(); // ✅ App Router
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
