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
      className={`relative flex items-center gap-8 ${className || ""}`}
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
              className="relative flex cursor-pointer items-center justify-center gap-1.5 py-3 px-7 text-[1.05rem] font-semibold transition-all duration-300 hover:text-indigo-500 hover:scale-105 group"
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
                    borderRadius: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  }}
                />
              )}
            </Link>
          ) : (
            <button
              className="relative flex cursor-pointer items-center justify-center gap-1.5 py-3 px-7 text-[1.05rem] font-semibold transition-all duration-300 hover:text-indigo-500 hover:scale-105 group"
              onMouseEnter={() => setIsHover(navItem.id)}
              onMouseLeave={() => setIsHover(null)}
              style={{ color: 'var(--text-main)' }}
            >
              <span>{navItem.label}</span>
              {navItem.subMenus && (
                <ChevronDown
                  className={`h-4.5 w-4.5 opacity-50 transition-transform duration-300 group-hover:rotate-180 ${
                    openMenu === navItem.label ? "rotate-180" : ""
                  }`}
                />
              )}
              {(isHover === navItem.id || openMenu === navItem.label) && (
                <motion.div
                  layoutId="hover-bg"
                  className="absolute inset-0 size-full"
                  style={{
                    borderRadius: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  }}
                />
              )}
            </button>
          )}

          <AnimatePresence>
            {openMenu === navItem.label && navItem.subMenus && (
              <div className="absolute left-0 top-full w-auto pt-5 z-50">
                <motion.div
                  className="w-max border shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl"
                  style={{
                    borderRadius: 24,
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    padding: '2rem', // Balanced p-8
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 24
                  }}
                  layoutId="menu"
                >
                  <div className="flex w-fit shrink-0 space-x-16 overflow-hidden">
                    {navItem.subMenus.map((sub) => (
                      <motion.div layout className="w-full min-w-[240px]" key={sub.title}>
                        <h3 className="mb-8 text-[0.75rem] font-bold uppercase tracking-[0.15em] opacity-40 px-4" style={{ color: 'var(--text-main)' }}>
                          {sub.title}
                        </h3>
                        <ul className="flex flex-col gap-3"> {/* Margin between items using gap */}
                          {sub.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <li key={item.label}>
                                <Link
                                  to={item.path || "#"}
                                  className="flex items-center gap-5 group p-4 rounded-2xl transition-all duration-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-indigo-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 shadow-sm">
                                    <Icon className="h-6 w-6 flex-none" />
                                  </div>
                                  <div className="flex flex-col gap-1.5 pr-6">
                                    <p className="text-[1rem] font-bold leading-tight" style={{ color: 'var(--text-main)' }}>
                                      {item.label}
                                    </p>
                                    <p className="text-[0.85rem] opacity-50 font-medium leading-relaxed whitespace-nowrap" style={{ color: 'var(--text-main)' }}>
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
