"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import {
  homeItems,
  blogItems,
  pageItems,
  dashboardItems,
  categorieMobileItems,
} from "../../data/mainMenuData";
import {
  isActiveLink,
  isActiveParent,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";
import Social from "../common/social/Social";
import ContactInfo from "./ContactInfo";
import LanguageMegaMenu from "./LanguageMegaMenu";

const MobileMenu = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <>
      <div className="pro-header d-flex align-items-center justify-between border-bottom-light">
        <Link href="/">
          <img src="/img/general/logo-dark.svg" alt="brand" />
        </Link>
        {/* End logo */}

        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="icon icon-close"></i>
        </div>
        {/* icon close */}
      </div>
      {/* End pro-header */}

      <ProSidebarProvider>
        <Sidebar width="400" backgroundColor="#fff">
          <Menu>
            <SubMenu label={t("navigation.home")}>
              {homeItems.map((item, i) => (
                <MenuItem
                  key={i}
                  component={
                    <Link
                      href={item.routePath}
                      className={
                        isActiveLink(item.routePath, router.asPath)
                          ? "menu-active-link"
                          : ""
                      }
                    />
                  }
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>
            {/* End  All Home Menu */}

            <SubMenu label={t("navigation.categories")}>
              {categorieMobileItems.map((item) => (
                <SubMenu label={item.title} key={item.id}>
                  {item.menuItems.map((single) => (
                    <SubMenu label={single.title} key={single.id}>
                      {single.menuList.map((menu, i) => (
                        <MenuItem
                          key={i}
                          component={
                            <Link
                              href={menu.routePath}
                              className={
                                isActiveLink(menu.routePath, router.asPath)
                                  ? "menu-active-link"
                                  : ""
                              }
                            />
                          }
                        >
                          {menu.name}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  ))}
                </SubMenu>
              ))}
            </SubMenu>
            {/* End  All Categories Menu */}

            <MenuItem
              component={
                <Link
                  href="/destinations"
                  className={
                    router.pathname === "/destinations"
                      ? "menu-active-link"
                      : ""
                  }
                />
              }
            >
              Desitinations
            </MenuItem>
            {/* End  Desitinations Menu */}

            <SubMenu label={t("navigation.blog")}>
              {blogItems.map((item, i) => (
                <MenuItem
                  key={i}
                  component={
                    <Link
                      href={item.routePath}
                      className={
                        isActiveLink(item.routePath, router.asPath)
                          ? "menu-active-link"
                          : ""
                      }
                    />
                  }
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>
            {/* End  All Blog Menu */}

            <SubMenu label={t("navigation.pages")}>
              {pageItems.map((item, i) => (
                <MenuItem
                  key={i}
                  component={
                    <Link
                      href={item.routePath}
                      className={
                        isActiveLink(item.routePath, router.asPath)
                          ? "menu-active-link"
                          : ""
                      }
                    />
                  }
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>
            {/* End  All Pages Menu */}

            <SubMenu label={t("navigation.dashboard")}>
              {dashboardItems.map((item, i) => (
                <MenuItem
                  key={i}
                  component={
                    <Link
                      href={item.routePath}
                      className={
                        isActiveLink(item.routePath, router.asPath)
                          ? "menu-active-link"
                          : ""
                      }
                    />
                  }
                >
                  {item.name}
                </MenuItem>
              ))}
            </SubMenu>
            {/* End  All Dashboard Menu */}

            <MenuItem
              component={
                <Link
                  href="/contact"
                  className={
                    router.pathname === "/contact" ? "menu-active-link" : ""
                  }
                />
              }
            >
              {t("navigation.contact")}
            </MenuItem>
            {/* End Contact  Menu */}
          </Menu>
        </Sidebar>
      </ProSidebarProvider>

      <div className="mobile-footer px-20 py-5 border-top-light">
        <LanguageMegaMenu />
      </div>

      <div className="pro-footer">
        <ContactInfo />
        <div className="mt-10">
          <h5 className="text-16 fw-500 mb-10">{t("footer.followUs")}</h5>
          <div className="d-flex x-gap-20 items-center">
            <Social />
          </div>
        </div>
        <div className="mt-20">
          <Link
            className=" button -dark-1 px-30 fw-400 text-14 bg-blue-1 h-50 text-white"
            href="/others-pages/login"
          >
            {t("header.becomeExpert")}
          </Link>
        </div>
      </div>
      {/* End pro-footer */}
    </>
  );
};

export default MobileMenu;
