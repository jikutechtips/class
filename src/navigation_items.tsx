import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import DomainIcon from "@mui/icons-material/Domain";
import { useSession } from "./SessionContext";

interface NavigationItem {
  title: string;
  icon?: React.ReactNode;
  segment?: string;
  visible?: boolean; // Add a visibility property
}

const allNavigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    visible: true, // All users can see the dashboard
  },
  {
    title: "Dental Entities",
    icon: <DomainIcon />,
    segment: "orders",
    visible: true, // All users can see this
  },
  {
    title: "Users",
    icon: <GroupsIcon />,
    segment: "page1",
    visible: false, // Initially hidden for all users
  },
  {
    title: "Demo",
    icon: <GroupsIcon />,
    segment: "demo",
    visible: false, // Initially hidden for all users
  },
  {
    title: "Staff Registration",
    icon: <GroupsIcon />,
    segment: "demo",
    visible: false, // Initially hidden for all users
  },
  // Add more items with visibility flags
];

const useNavigationItems = () => {
  const { session } = useSession();

  const getVisibleItems = (): NavigationItem[] => {
    if (!session?.user || !session?.user.title) {
      return allNavigationItems.filter((item) => item.visible);
    }

    switch (session.user.title) {
      case "manager":
        return allNavigationItems; // Managers see all items

      case "tech":
        return allNavigationItems.filter(
          (item) =>
            item.visible &&
            (item.segment === "dashboard" || item.segment === "orders")
        );
      // Dental technicians see only dashboard and orders

      default:
        return allNavigationItems.filter((item) => item.visible);
    }
  };
  return getVisibleItems();
};

export default useNavigationItems;
