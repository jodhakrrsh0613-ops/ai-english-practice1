import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const MegaMenu = React.forwardRef(({ items, className, ...props }, ref) => {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [isHover, setIsHover] = React.useState(null);

  const handleHover = (menuLabel) => {
    setOpenMenu(menuLabel);
  };

  return (
    <ul
      ref={ref}
      className={`relative flex items-center gap-6 ${className || ""}`}
      {...props}
    >
      {items.map((navItem) => (
        <li
          key={navItem.label}
          className="relative"
          onMouseEnter={() => handleHover(navItem.label)}
          onMouseLeave={() => handleHover(null)}
        >
          {navItem.link ? (
            <Link
              to={navItem.link}
              className="relative flex cursor-pointer items-center justify-center gap-1 py-2 px-4 text-[0.95rem] font-medium transition-colors duration-300 hover:text-indigo-500 group"
              onMouseEnter={() => setIsHover(navItem.id)}
              onMouseLeave={() => setIsHover(null)}
              style={{ color: 'var(--text-main)' }}
            >
              <span>{navItem.label}</span>
              {(isHover === navItem.id || openMenu === navItem.label) && (
                <motion.div
                  layoutId="hover-bg"
                  className="absolute inset-0 size-full"
                  style={{
                    borderRadius: 99,
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  }}
                />
              )}
            </Link>
          ) : (
            <button
              className="relative flex cursor-pointer items-center justify-center gap-1 py-2 px-4 text-[0.95rem] font-medium transition-colors duration-300 hover:text-indigo-500 group"
              onMouseEnter={() => setIsHover(navItem.id)}
              onMouseLeave={() => setIsHover(null)}
              style={{ color: 'var(--text-main)' }}
            >
              <span>{navItem.label}</span>
              {navItem.subMenus && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-180 ${
                    openMenu === navItem.label ? "rotate-180" : ""
                  }`}
                />
              )}
              {(isHover === navItem.id || openMenu === navItem.label) && (
                <motion.div
                  layoutId="hover-bg"
                  className="absolute inset-0 size-full"
                  style={{
                    borderRadius: 99,
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  }}
                />
              )}
            </button>
          )}

          <AnimatePresence>
            {openMenu === navItem.label && navItem.subMenus && (
              <div className="absolute left-0 top-full w-auto pt-2 z-50">
                <motion.div
                  className="w-max border p-4 shadow-2xl backdrop-blur-xl"
                  style={{
                    borderRadius: 16,
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  layoutId="menu"
                >
                  <div className="flex w-fit shrink-0 space-x-9 overflow-hidden p-2">
                    {navItem.subMenus.map((sub) => (
                      <motion.div layout className="w-full" key={sub.title}>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider opacity-50" style={{ color: 'var(--text-main)' }}>
                          {sub.title}
                        </h3>
                        <ul className="space-y-4">
                          {sub.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <li key={item.label}>
                                <Link
                                  to={item.path || "#"}
                                  className="flex items-start space-x-3 group p-2 rounded-lg transition-colors hover:bg-indigo-500/10"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md border text-indigo-500 transition-colors duration-300 group-hover:bg-indigo-500 group-hover:text-white" style={{ borderColor: 'var(--border-color)' }}>
                                    <Icon className="h-5 w-5 flex-none" />
                                  </div>
                                  <div className="w-max leading-5">
                                    <p className="shrink-0 text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                                      {item.label}
                                    </p>
                                    <p className="shrink-0 text-xs opacity-60" style={{ color: 'var(--text-main)' }}>
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
});

MegaMenu.displayName = "MegaMenu";

export default MegaMenu;
