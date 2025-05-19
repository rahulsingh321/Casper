$(document).ready(function () {
  const $dropdownButtons = $(".nav-dropdown");
  const $mobileNavButton = $(".mobile-nav-button");
  const $mobileSidebar = $(".mobile-nav-sidebar");

  // Toggle mobile sidebar visibility
  $mobileNavButton.on("click", function (e) {
    e.stopPropagation();
    $mobileSidebar.toggleClass("open");
  });

  // Toggle dropdowns
  $dropdownButtons.on("click", function (e) {
    e.stopPropagation(); // Prevent outside click handler

    // Close all other dropdowns
    $dropdownButtons.not(this).find(".dropdown-box").removeClass("show");

    // Toggle this dropdown
    $(this).find(".dropdown-box").toggleClass("show");
  });

  // Close all dropdowns when clicking outside
  $(document).on("click", function () {
    $dropdownButtons.find(".dropdown-box").removeClass("show");
  });
});
