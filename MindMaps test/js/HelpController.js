/**
 * <pre>
 * Listens to HELP_COMMAND and displays notifications.
 * Provides interactive tutorial for first time users.
 * </pre>
 * 
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.commandRegistry} commandRegistry
 */
mindmaps.HelpController = function(eventBus, commandRegistry) {

  /**
   * Prepare tutorial guiders.
   */
  function setupInteractiveMode() {
    if (isTutorialDone()) {
      console.debug("skipping tutorial");
      return;
    }

    var notifications = [];
    var interactiveMode = true;

    // start tutorial after a short delay
    eventBus.once(mindmaps.Event.DOCUMENT_OPENED, function() {
      setTimeout(start, 1000);
    });

    function closeAllNotifications() {
      notifications.forEach(function(n) {
        n.close();
      });
    }

		var helpMain, helpRoot;
		function start() {
			helpMain = new mindmaps.Notification(
					"#toolbar",
					{
						position : "bottomMiddle",
						maxWidth : 550,
						title : "Bienvenue dans mindmaps",
						content : "Bonjour, il semble que vous &ecirc;tes nouveau ici! Ces bulles "
								+ "vous guideront &agrave; travers l'application. Si vous voulez sauter ce tutoriel et <a class='skip-tutorial link'>cliquez ici<a/>."
					});
			notifications.push(helpMain);
			helpMain.$().find("a.skip-tutorial").click(function() {
				interactiveMode = false;
				closeAllNotifications();
				tutorialDone();
			});
			setTimeout(theRoot, 2000);
		}

    function theRoot() {
      if (isTutorialDone())
        return;

			helpRoot = new mindmaps.Notification(
					".node-caption.root",
					{
						position : "bottomMiddle",
						closeButton : true,
						maxWidth : 350,
						title : "C'est l&agrave; que vous commencez - votre id&eacute;e principale",
						content : "Double-cliquez sur l'id&eacute;e afin de la modifier. Ce sera le sujet principal de votre carte."
					});
			notifications.push(helpRoot);

      eventBus.once(mindmaps.Event.NODE_TEXT_CAPTION_CHANGED, function() {
        helpRoot.close();
        setTimeout(theNub, 900);
      });
    }

    function theNub() {
      if (isTutorialDone())
        return;

      var helpNub = new mindmaps.Notification(
          ".node-caption.root",
          {
            position : "bottomMiddle",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "Creating new ideas",
            content : "Now it's time to build your mind map.<br/> Move your mouse over the idea, click and then drag"
                + " the <span style='color:red'>red circle</span> away from the root. This is how you create a new branch."
          });
      notifications.push(helpNub);
      eventBus.once(mindmaps.Event.NODE_CREATED, function() {
        helpMain.close();
        helpNub.close();
        setTimeout(newNode, 900);
      });
    }

    function newNode() {
      if (isTutorialDone())
        return;

			var helpNewNode = new mindmaps.Notification(
					".node-container.root > .node-container:first",
					{
						position : "bottomMiddle",
						closeButton : true,
						maxWidth : 350,
						title : "Votre premi&egrave;re branche",
						content : "Bravo! Facile, n'est-ce pas? Le cercle rouge est votre outil le plus important. Maintenant, vous pouvez d&eacute;placer votre id&eacute;e"
								+ " sur votre feuille en la glissant avec la souris. Double-cliquer sur le texte pour le modifier."
					});
			notifications.push(helpNewNode);
			setTimeout(inspector, 2000);

      eventBus.once(mindmaps.Event.NODE_MOVED, function() {
        helpNewNode.close();
        setTimeout(navigate, 0);
        setTimeout(toolbar, 15000);
        setTimeout(menu, 10000);
        setTimeout(tutorialDone, 20000);
      });
    }

    function navigate() {
      if (isTutorialDone())
        return;

			var helpNavigate = new mindmaps.Notification(
					".float-panel:has(#navigator)",
					{
						position : "bottomRight",
						closeButton : true,
						maxWidth : 350,
						expires : 10000,
						title : "Navigation",
						content : "Vous pouvez cliquer et faire glisser le fond de la carte pour vous d&eacute;placer. Utilisez votre molette de la souris pour zoomer et d&eacute;zoomer."
					});
			notifications.push(helpNavigate);
		}

    function inspector() {
      if (isTutorialDone())
        return;

      var helpInspector = new mindmaps.Notification(
          "#inspector",
          {
            position : "leftBottom",
            closeButton : true,
            maxWidth : 350,
            padding : 20,
            title : "Don't like the colors?",
            content : "Use these controls to change the appearance of your ideas. "
                + "Try clicking the icon in the upper right corner to minimize this panel."
          });
      notifications.push(helpInspector);
    }

    function toolbar() {
      if (isTutorialDone())
        return;

			var helpToolbar = new mindmaps.Notification(
					"#toolbar .buttons-left",
					{
						position : "bottomLeft",
						closeButton : true,
						maxWidth : 350,
						padding : 20,
						title : "La barre d'outils",
						content : "Ces boutons font ce qu'ils disent. Vous pouvez les utiliser ou travailler avec des raccourcis clavier. "
								+ "Survolez les boutons pour les combinaisons de touches."
					});
			notifications.push(helpToolbar);
		}

    function menu() {
      if (isTutorialDone())
        return;

			var helpMenu = new mindmaps.Notification(
					"#toolbar .buttons-right",
					{
						position : "leftTop",
						closeButton : true,
						maxWidth : 350,
						title : "Enregistrer votre travail",
						content : "Le bouton &agrave; droite ouvre un menu o&ugrave; vous pouvez enregistrer votre carte ou commencer &agrave; travailler"
								+ "sur une autre carte si vous voulez."
					});
			notifications.push(helpMenu);
		}

    function isTutorialDone() {
      return mindmaps.LocalStorage.get("mindmaps.tutorial.done") == 1;
    }

    function tutorialDone() {
      mindmaps.LocalStorage.put("mindmaps.tutorial.done", 1);
    }

  }

  /**
   * Prepares notfications to show for help command.
   */
  function setupHelpButton() {
    var command = commandRegistry.get(mindmaps.HelpCommand);
    command.setHandler(showHelp);

    var notifications = [];
    function showHelp() {
      // true if atleast one notifications is still on screen
      var displaying = notifications.some(function(noti) {
        return noti.isVisible();
      });

      // hide notifications if visible
      if (displaying) {
        notifications.forEach(function(noti) {
          noti.close();
        });
        notifications.length = 0;
        return;
      }

			// show notifications
			var helpRoot = new mindmaps.Notification(
					".node-caption.root",
					{
						position : "bottomLeft",
						closeButton : true,
						maxWidth : 350,
						title : "Ceci est votre id&eacute;e principale",
						content : "Double-cliquez sur une id&eacute;e afin d'&eacute;diter son texte. D&eacute;placez la souris sur "
								+ "sur une id&eacute;e et faire glisser le cercle rouge pour cr&eacute;er une nouvelle id&eacute;e."
					});

			var helpNavigator = new mindmaps.Notification(
					"#navigator",
					{
						position : "leftTop",
						closeButton : true,
						maxWidth : 350,
						padding : 20,
						title : "Ceci est la navigateur",
						content : "Utilisez ce panel pour avoir un aper&ccedil;u de votre carte. "
								+ "Vous pouvez naviguer autour en faisant glisser le rectangle rouge ou modifier le zoom en cliquant sur ​​les boutons loupe."
					});

			var helpInspector = new mindmaps.Notification(
					"#inspector",
					{
						position : "leftTop",
						closeButton : true,
						maxWidth : 350,
						padding : 20,
						title : "Ceci est l'inspecteur",
						content : "Utilisez ces contr&ocirc;les pour modifier l'apparence de vos id&eacute;es. "
								+ "Essayez de cliquer sur l'ic&ocirc;ne dans le coin sup&eacute;rieur droit afin de minimiser ce panel."
					});

			var helpToolbar = new mindmaps.Notification(
					"#toolbar .buttons-left",
					{
						position : "bottomLeft",
						closeButton : true,
						maxWidth : 350,
						title : "Ceci est votre barre d'outils",
						content : "Ces boutons font ce qu'ils disent. Vous pouvez les utiliser ou travailler avec des raccourcis clavier. "
								+ "Survolez les boutons pour les combinaisons de touches."
					});

      notifications.push(helpRoot, helpNavigator, helpInspector,
          helpToolbar);
    }
  }

  setupInteractiveMode();
  setupHelpButton();
};
