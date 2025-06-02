$(function () {
  const $dropdownButtons = $(".nav-dropdown");
  const $mobileNavButton = $(".mobile-nav-button");
  const $mobileSidebar   = $(".mobile-nav-sidebar");

  // Toggle mobile sidebar
  $mobileNavButton.on("click", function (e) {
    e.stopPropagation();
    $mobileSidebar.toggleClass("open");
  });

  // Handle dropdown toggle
  $dropdownButtons.on("click", function (e) {
    e.stopPropagation();
    const $currentDropdown = $(this).find(".dropdown-box");

    // Close all other dropdowns
    $(".dropdown-box").not($currentDropdown).removeClass("show");

    // Toggle current dropdown
    $currentDropdown.toggleClass("show");
  });

  // Close dropdowns on outside click
  $(document).on("click", function () {
    $(".dropdown-box").removeClass("show");
  });
});
