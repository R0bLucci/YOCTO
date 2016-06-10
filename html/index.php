<?php include_once "../to_from.php"; ?>

<?php include_once "../template/header.php"; ?>

<form method="POST" action="<?php echo $_SERVER["PHP_SELF"]; ?>">
	<div class="selection">
		<label for="from_s"> From: </label>
			<?php Station::stations("from"); ?>
	</div>
	<div class="selection">
		<label for="to_s"> To: </label>
			<?php Station::stations("to"); ?>
	</div>
	<input type="submit" name="submit" value="Go" />
</form>
<div id="page">
	<div class="container">
		<div class="legend">
			<h2> From </h2>
			<p> On time: Green </p>
			<p> Cancelled: Red </p>
			<p> Delayed: Orange </p>
			<p> Unkown: Blue </p>
			<p> No report: White </p>
		</div>
		<div id="chart_from">
		</div>
		<div id="bar_from">
		</div>
	</div>

	<div class="container">
		<div class="legend">
			<h2> To </h2>
			<p> On time: Green </p>
			<p> Cancelled: Red </p>
			<p> Delayed: Orange </p>
			<p> Unkown: Blue </p>
			<p> No report: White </p>
		</div>
		<div id="chart_to">
		</div>
		<div id="bar_to">
		</div>
	</div>
</div>

<?php include_once "../template/footer.php"; ?>
