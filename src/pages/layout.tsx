import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { LuSquareStack } from "react-icons/lu";
import { BiHome as LuHome } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import {
  FluentProvider,
  makeStyles,
  Tooltip,
  useRestoreFocusTarget,
  webLightTheme,
} from "@fluentui/react-components";
import {
  AppItem,
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
} from "@fluentui/react-nav-preview";

import { cn } from "~/lib/utils";
import { useState } from "react";
import {
  bundleIcon,
  Home20Filled,
  Home20Regular,
  PersonCircle32Regular,
  Settings20Filled,
  Settings20Regular,
  Person20Filled,
  Person20Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "98vh",
    overflow: "hidden",
  },
  nav: {
    minWidth: "200px",
  },
  content: {
    flex: 1,
    padding: "1rem",
    // display: "grid",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
  },
});

const Home = bundleIcon(Home20Filled, Home20Regular);
const Person = bundleIcon(Person20Filled, Person20Regular);
const Settings = bundleIcon(Settings20Filled, Settings20Regular);

export default function RootLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles();
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={classes.container}>
        <NavDrawer
          open={isOpen}
          type="inline"
          className={classes.nav}
          // @ts-ignore
          onNavItemSelect={(event, { value }) => navigate(value)}
          selectedValue={pathname}
        >
          <NavDrawerBody>
            <AppItem icon={<PersonCircle32Regular />} as="a">
              Contoso HR
            </AppItem>
            <NavItem icon={<Home />} value="/">
              Home
            </NavItem>
            <NavItem icon={<Person />} value="/students">
              Student
            </NavItem>
            <NavItem icon={<Settings />} value="/settings">
              Settings
            </NavItem>
          </NavDrawerBody>
        </NavDrawer>
        <main className={classes.content}>
          <Tooltip content="Toggle navigation pane" relationship="label">
            <Hamburger onClick={toggle} {...restoreFocusTargetAttributes} />
          </Tooltip>
          <Outlet />
        </main>
        <div id="blabla" />
      </div>
    </FluentProvider>
  );
}
