<script runat="server">
Platform.Load("core", "1.1.1");

/* Error_Log_DE fields: Source (Text 100), Message (Text 4000), CreatedAt (Date) */
function logError(source, err) {
  DataExtension.Init("Error_Log_DE").Rows.Add({
    Source: source,
    Message: Stringify(err),
    CreatedAt: Now()
  });
}

try {
  // work goes here
} catch (e) {
  logError("Nightly_Script", e);
}
</script>
