var sh_accounts_name = 'Accounts';
var sh_properties_name = 'Properties';
var sh_profiles_name = 'Profiles';

function getListAnalyticsPermissions() {
  listAccounts_();
}

function listAccounts_() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_accounts_name).clear();
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_properties_name).clear();
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_profiles_name).clear();
  var arr_account = [];
  var accounts = Analytics.Management.Accounts.list();
  if (accounts.items && accounts.items.length) {
    for (var i = 0; i < accounts.items.length; i++) {
      var account = accounts.items[i];
      arr_account.push([account.id, account.name, account.permissions.effective.join()]);
      listWebProperties_(account.id);
    }
  } else {
    Logger.log('No accounts found.');
  }
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_accounts_name).getRange(1, 1, arr_account.length, 3).setValues(arr_account);
}

function listWebProperties_(accountId) {
  Utilities.sleep(200);
  var arr_property = [];
  var webProperties = Analytics.Management.Webproperties.list(accountId);
  if (webProperties.items && webProperties.items.length) {
    for (var i = 0; i < webProperties.items.length; i++) {
      var webProperty = webProperties.items[i];
      arr_property.push([webProperty.id, webProperty.name, webProperty.permissions.effective.join(), accountId]);
      listProfiles_(accountId, webProperty.id);
    }
  } else {
    Logger.log('\tNo web properties found.');
  }
  var sh_properties_ref = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_properties_name);
  var last_properties_row = sh_properties_ref.getLastRow();
  sh_properties_ref.getRange(last_properties_row+1, 1, arr_property.length, 4).setValues(arr_property);
}

function listProfiles_(accountId, webPropertyId) {
  Utilities.sleep(200);
  var arr_profiles = [];
  var profiles = Analytics.Management.Profiles.list(accountId, webPropertyId);
  if (profiles.items && profiles.items.length) {
    for (var i = 0; i < profiles.items.length; i++) {
      var profile = profiles.items[i];
      arr_profiles.push([profile.id, profile.name, profile.permissions.effective.join(), accountId, webPropertyId]);
    }
  } else {
    Logger.log('\t\tNo web properties found.');
  }
  var sh_profiles_ref = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sh_profiles_name);
  var last_profiles_row = sh_profiles_ref.getLastRow();
  sh_profiles_ref.getRange(last_profiles_row+1, 1, arr_profiles.length, 5).setValues(arr_profiles);
}
