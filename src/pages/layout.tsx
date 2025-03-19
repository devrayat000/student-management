import { Outlet, useLocation, useNavigate } from "react-router";
import {
  Button,
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
  NavItem,
} from "@fluentui/react-nav-preview";

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
  ArrowLeft16Filled,
  ArrowLeft16Regular,
  Class20Filled,
  Class20Regular,
  PeopleTeam20Filled,
  PeopleTeam20Regular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  nav: {
    minWidth: "200px",
  },
  content: {
    flex: 1,
    padding: "1rem",
    overflowY: "auto",
  },
  control: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appItem: { flex: 1 },
});

const Left = bundleIcon(ArrowLeft16Filled, ArrowLeft16Regular);
const Home = bundleIcon(Home20Filled, Home20Regular);
const Person = bundleIcon(Person20Filled, Person20Regular);
const Settings = bundleIcon(Settings20Filled, Settings20Regular);
const Class = bundleIcon(Class20Filled, Class20Regular);
const Group = bundleIcon(PeopleTeam20Filled, PeopleTeam20Regular);

export default function RootLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles();
  const restoreFocusTargetAttributes = useRestoreFocusTarget();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <FluentProvider theme={webLightTheme} applyStylesToPortals>
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
            <div className={classes.control}>
              <Button
                appearance="subtle"
                onClick={() => navigate(-1)}
                className="justify-self-start"
                icon={<Left />}
                disabled={pathname === "/"}
              />
              <AppItem
                icon={<PersonCircle32Regular />}
                onClick={() => navigate("/")}
                className={classes.appItem}
              >
                Contoso HR
              </AppItem>
            </div>
            <NavItem icon={<Home />} value="/">
              Home
            </NavItem>
            <NavItem icon={<Person />} value="/students">
              Students
            </NavItem>
            <NavItem icon={<Class />} value="/classes">
              Classes
            </NavItem>
            <NavItem icon={<Group />} value="/batches">
              Batches
            </NavItem>
            {/* <NavItem icon={<Settings />} value="/settings">
              Settings
            </NavItem> */}
          </NavDrawerBody>
        </NavDrawer>
        <main className={classes.content}>
          <Tooltip content="Toggle navigation pane" relationship="label">
            <Hamburger onClick={toggle} {...restoreFocusTargetAttributes} />
          </Tooltip>
          <Outlet />
        </main>
      </div>
      <div id="dialog-portal"></div>
      <div id="dropdown-portal"></div>
    </FluentProvider>
  );
}
