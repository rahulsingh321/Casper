(function () {
    function dropdownChevronForTrigger(trigger) {
        return trigger.querySelector('.icon-chevron');
    }

    function initNavbar() {
        const root = document.querySelector('[data-navbar-root]') || document.querySelector('.fixed.left-0.top-0');
        if (!root) {
            return;
        }

        const navEls = root.querySelectorAll('.nav-el');
        const cleanupFns = [];

        const dropdownForTrigger = function (trigger) {
            const wrapper = trigger.closest('.relative');
            if (!wrapper) {
                return null;
            }

            const children = Array.from(wrapper.children);
            return children.find((child) => child.tagName === 'DIV') || null;
        };

        const setDropdownState = function (dropdown, chevron, open) {
            dropdown.classList.toggle('opacity-0', !open);
            dropdown.classList.toggle('pointer-events-none', !open);
            dropdown.classList.toggle('scale-95', !open);
            dropdown.classList.toggle('max-h-[0px]', !open);

            dropdown.classList.toggle('opacity-100', open);
            dropdown.classList.toggle('pointer-events-auto', open);
            dropdown.classList.toggle('scale-100', open);

            chevron.classList.toggle('rotate-180', open);
        };

        const closeDropdownForTrigger = function (trigger) {
            const dropdown = dropdownForTrigger(trigger);
            const chevron = dropdownChevronForTrigger(trigger);
            if (!dropdown || !chevron) {
                return;
            }

            setDropdownState(dropdown, chevron, false);
        };

        const closeAllDropdowns = function () {
            navEls.forEach(function (trigger) {
                closeDropdownForTrigger(trigger);
            });
        };

        navEls.forEach(function (trigger) {
            const onClick = function (event) {
                event.stopPropagation();

                navEls.forEach(function (otherTrigger) {
                    if (otherTrigger !== trigger) {
                        closeDropdownForTrigger(otherTrigger);
                    }
                });

                const dropdown = dropdownForTrigger(trigger);
                const chevron = dropdownChevronForTrigger(trigger);
                if (!dropdown || !chevron) {
                    return;
                }

                const isOpen = dropdown.classList.contains('opacity-100');
                setDropdownState(dropdown, chevron, !isOpen);
            };

            trigger.addEventListener('click', onClick);
            cleanupFns.push(function () {
                trigger.removeEventListener('click', onClick);
            });
        });

        const onDocumentClick = function (event) {
            if (!root.contains(event.target)) {
                closeAllDropdowns();
            }
        };

        document.addEventListener('click', onDocumentClick);
        cleanupFns.push(function () {
            document.removeEventListener('click', onDocumentClick);
        });

        const burger = root.querySelector('#burger');
        const nav = root.querySelector('nav');
        if (burger && nav) {
            const onBurgerClick = function (event) {
                event.stopPropagation();
                nav.classList.toggle('opacity-0');
                nav.classList.toggle('!translate-x-full');
            };

            burger.addEventListener('click', onBurgerClick);
            cleanupFns.push(function () {
                burger.removeEventListener('click', onBurgerClick);
            });
        }

        window.addEventListener('beforeunload', function () {
            cleanupFns.forEach(function (fn) {
                fn();
            });
        }, {once: true});
    }

    function initCurrentYear() {
        const yearEls = document.querySelectorAll('[data-current-year]');
        if (!yearEls.length) {
            return;
        }
        const year = String(new Date().getFullYear());
        yearEls.forEach(function (el) {
            el.textContent = year;
        });
    }

    function parseBoolean(value, defaultValue) {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        return String(value).toLowerCase() === 'true';
    }

    function initCollapsibles() {
        const roots = document.querySelectorAll('[data-controller="collapsible"]');
        if (!roots.length) {
            return;
        }

        roots.forEach(function (root) {
            const rotateClass = root.getAttribute('data-collapsible-rotate-class-value') || 'rotate-180';
            const collapsedHeight = root.getAttribute('data-collapsible-collapsed-height-value') || '0px';
            const singleOpen = parseBoolean(root.getAttribute('data-collapsible-single-open-value'), false);
            const disableAboveBreakpoint = parseBoolean(root.getAttribute('data-collapsible-disable-above-breakpoint-value'), true);
            const desktopBreakpoint = Number(root.getAttribute('data-collapsible-desktop-breakpoint-value') || 1024);
            const items = root.querySelectorAll('[data-collapsible-target="item"]');

            const isExpanded = function (content) {
                const maxHeight = (content.style.maxHeight || '').trim();
                return maxHeight !== '' && maxHeight !== collapsedHeight;
            };

            const setExpandedState = function (trigger, expanded) {
                if (!trigger) {
                    return;
                }
                trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            };

            const setIconState = function (icon, expanded) {
                if (!icon) {
                    return;
                }
                icon.classList.toggle(rotateClass, expanded);
            };

            const collapse = function (content, icon, trigger) {
                content.style.maxHeight = collapsedHeight;
                setExpandedState(trigger, false);
                setIconState(icon, false);
            };

            const expand = function (content, icon, trigger) {
                content.style.maxHeight = content.scrollHeight + 'px';
                setExpandedState(trigger, true);
                setIconState(icon, true);
            };

            const closeSiblings = function (activeItem) {
                items.forEach(function (item) {
                    if (item === activeItem) {
                        return;
                    }
                    const content = item.querySelector('[data-collapsible-target="content"]');
                    if (!content) {
                        return;
                    }
                    const trigger = item.querySelector('[data-collapsible-target="trigger"]');
                    const icon = item.querySelector('[data-collapsible-target="icon"]');
                    collapse(content, icon, trigger);
                });
            };

            const syncState = function () {
                items.forEach(function (item) {
                    const content = item.querySelector('[data-collapsible-target="content"]');
                    if (!content) {
                        return;
                    }
                    const trigger = item.querySelector('[data-collapsible-target="trigger"]');
                    const icon = item.querySelector('[data-collapsible-target="icon"]');
                    const expanded = isExpanded(content);
                    setExpandedState(trigger, expanded);
                    setIconState(icon, expanded);
                });
            };

            items.forEach(function (item) {
                const trigger = item.querySelector('[data-collapsible-target="trigger"]');
                if (!trigger) {
                    return;
                }

                trigger.addEventListener('click', function () {
                    if (disableAboveBreakpoint && window.innerWidth >= desktopBreakpoint) {
                        return;
                    }

                    const content = item.querySelector('[data-collapsible-target="content"]');
                    if (!content) {
                        return;
                    }
                    const icon = item.querySelector('[data-collapsible-target="icon"]');
                    const expanded = isExpanded(content);

                    if (!expanded && singleOpen) {
                        closeSiblings(item);
                    }

                    if (expanded) {
                        collapse(content, icon, trigger);
                        return;
                    }

                    expand(content, icon, trigger);
                });
            });

            syncState();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initNavbar();
            initCollapsibles();
            initCurrentYear();
        }, {once: true});
    } else {
        initNavbar();
        initCollapsibles();
        initCurrentYear();
    }
})();
