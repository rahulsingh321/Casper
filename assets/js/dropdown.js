(function () {
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
            const chevron = trigger.querySelector('.material-symbols-rounded');
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
                const chevron = trigger.querySelector('.material-symbols-rounded');
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar, {once: true});
    } else {
        initNavbar();
    }
})();
