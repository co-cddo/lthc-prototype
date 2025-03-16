(function () {

  function SuperNavigationMegaMenu($module) {
    this.$module = $module;

    if (!this.$module) return;

    // Initialize properties before calling init
    this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle');
    this.$searchMenu = this.$module.querySelector('#super-search-menu');
    this.$navToggle = this.$module.querySelector('#super-navigation-menu-toggle');
    this.$navMenu = this.$module.querySelector('#super-navigation-menu');
    this.$buttons = this.$module.querySelectorAll(
      'button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]'
    );
    this.hiddenButtons = this.$module.querySelectorAll('button[hidden]');

    // Call init after properties are set
    this.init();
  }

  SuperNavigationMegaMenu.prototype.init = function () {
    if (!this.$module) return;

    // Ensure handleKeyDown exists
    if (typeof this.handleKeyDown === 'function') {
      this.$module.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    if (this.$buttons.length) {
      this.$buttons.forEach(($button) => {
        $button.addEventListener('click', this.buttonHandler.bind(this), true);
      });
    }

    if (this.hiddenButtons.length) {
      this.hiddenButtons.forEach(($element) => {
        $element.removeAttribute('hidden');
        var closestSiblingLink = $element.previousElementSibling;
        if (closestSiblingLink && closestSiblingLink.tagName.toLowerCase() === 'a') {
          closestSiblingLink.setAttribute('hidden', 'hidden');
        }
      });
    }

    var $searchItemLink = this.$module.querySelector('.gem-c-layout-super-navigation-header__search-item-link');
    if ($searchItemLink) {
      $searchItemLink.setAttribute('hidden', 'hidden');
    }

    if (this.$searchToggle && this.$searchMenu) {
      hide(this.$searchToggle, this.$searchMenu);
    }

    this.$module.classList.add('js-module-initialised');
  };

  // Define handleKeyDown to prevent undefined errors
  SuperNavigationMegaMenu.prototype.handleKeyDown = function (event) {
    // Placeholder function (implement logic if needed)
  };

  function hide($button, $menu) {
    if ($button && $menu) {
      $button.setAttribute('aria-expanded', false);
      $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
      $menu.setAttribute('hidden', 'hidden');
    }
  }

  function show($button, $menu) {
    if ($button && $menu) {
      $button.setAttribute('aria-expanded', true);
      $button.classList.add('gem-c-layout-super-navigation-header__open-button');
      $menu.removeAttribute('hidden');
    }
  }

  function toggle($button, $menu) {
    if ($button && $menu) {
      if ($button.getAttribute('aria-expanded') === 'true') {
        hide($button, $menu);
      } else {
        show($button, $menu);
      }
    }
  }

  SuperNavigationMegaMenu.prototype.buttonHandler = function (event) {
    var $target = event.target.closest('button');
    if (!$target) return;

    var $targetMenu = this.$module.querySelector('#' + $target.getAttribute('aria-controls'));
    if (!$targetMenu) return;

    var toggleGroupName = $target.getAttribute('data-toggle-desktop-group');
    var toggleGroupList = this.$module.querySelectorAll(`[data-toggle-desktop-group="${toggleGroupName}"]`);

    toggleGroupList.forEach(($element) => {
      if ($element !== $target) {
        hide($element, this.$module.querySelector('#' + $element.getAttribute('aria-controls')));
      }
    });

    toggle($target, $targetMenu);
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.gem-c-layout-super-navigation-header').forEach(function ($module) {
      new SuperNavigationMegaMenu($module);
    });
  });

})();
