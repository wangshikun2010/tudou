﻿<?php require 'config.php'; ?>

	<?php require 'header.php'; ?>

	<div id="main">
		<div id="slider-wrapper">
			<div id="slider" class="nivoSlider">
			   <img src="./images/1.jpg"/>
			   <img src="./images/2.jpg"/>
			</div>
		</div>
	</div>

	<?php require 'footer.php'; ?>
</body>
<script type="text/javascript">
	$(function() {
		$('#slider').nivoSlider({
            slices: 10
            // pauseTime: 100000,
            // animSpeed: 70000
        });
        $("#nav").lavaLamp({
            fx: "backout",
            speed: 700,
            click: function(b, a) {
                return true;
            }
        })
	});
</script>
</html>
