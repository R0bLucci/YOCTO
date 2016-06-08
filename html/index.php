<?php include_once "../to_from.php"; ?>

<?php include_once "../template/header.php"; ?>

<form method="POST" action="<?php echo $_SERVER["PHP_SELF"]; ?>">
	<div class="selection">
		<label for="from_s"> To: 
			<?php Station::stations("from"); ?>
		</label>
	</div>
	<div class="selection">
		<label for="to_s"> From:
			<?php Station::stations("to"); ?>
		</label>
	</div>
	<input type="submit" name="submit" value="Go" />
</form>


<div id="chart_to">
</div>
<div id="chart_from">
</div>

<?php include_once "../model/statistic.php"; ?>

<?php include_once "../template/footer.php"; ?>
