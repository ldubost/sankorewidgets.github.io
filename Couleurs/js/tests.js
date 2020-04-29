

test( "hello test", function() {
  ok( 1 == "1", "Passed!" );
});

test( "Test outil courant par défaut", function() {
  ok( 0 == getCurrentTool(), "De la bombe !" );
});

test( "Test outil courant après sélection du feutre", function() {
	setTool('marker');
  ok( 1 == getCurrentTool(), "De la bombe !" );
});
