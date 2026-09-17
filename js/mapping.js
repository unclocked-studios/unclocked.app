(function (root) {
  'use strict';
  var recipient = 'support@unclocked.app';
  var subject = 'Warehouse mapping request';
  function draft(values) {
    var value = function (key) { return String(values[key] || '').trim(); };
    return 'Hello Unclocked Studios,\n\nI would like to discuss mapping my warehouse layout into a coordinate CSV.\n\n' +
      'Name: ' + value('name') + '\n' +
      'Company: ' + (value('company') || 'Not specified') + '\n' +
      'Drawing format: ' + (value('format') || 'Not sure yet') + '\n' +
      'Approximate locations: ' + (value('count') || 'Not sure yet') + '\n' +
      'Levels / height information: ' + (value('levels') || 'To discuss') + '\n\n' +
      'Project description:\n' + value('description') + '\n\n' +
      'Requested output: location names with X, Y, and Z coordinates.\n' +
      'Please let me know the next steps for sharing the drawing and confirming the scope.\n\nThank you!';
  }
  function emailLink(body) {
    return 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  function delivery(body) {
    var href = emailLink(body);
    return { href: href, copyRequired: href.length > 1800 };
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { draft: draft, emailLink: emailLink, delivery: delivery };
  }
  if (!root.document) return;
  var document = root.document;
  var form = document.getElementById('mapping-form');
  if (!form) return;
  var preview = document.getElementById('request-preview');
  var status = document.getElementById('request-status');
  var copy = document.getElementById('copy-request');
  var prepare = document.getElementById('prepare-request');
  var manual = document.getElementById('manual-copy-help');
  var longHelp = document.getElementById('long-request-help');
  var details = document.getElementById('draft-details');
  form.querySelector('fieldset').disabled = false;
  function readValues() {
    var values = {};
    new root.FormData(form).forEach(function (value, key) { values[key] = value; });
    return values;
  }
  function update() {
    var values = readValues();
    ['name', 'description'].forEach(function (name) {
      form.elements.namedItem(name).setCustomValidity(String(values[name] || '').trim() ? '' : 'Please complete this field.');
    });
    preview.value = draft(values);
    var result = delivery(preview.value);
    longHelp.hidden = !result.copyRequired;
    prepare.textContent = result.copyRequired ? 'Prepare email with copy instructions' : 'Prepare request email';
    return result;
  }
  form.addEventListener('input', function () { update(); status.textContent = ''; });
  form.addEventListener('change', update);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var result = update();
    if (!form.reportValidity()) return;
    if (result.copyRequired) {
      status.textContent = 'This draft is too long for a reliable email link. Copy the complete request below, then open an email and paste it. Nothing has been sent.';
      details.open = true;
      preview.focus();
      preview.select();
      return;
    }
    status.textContent = 'Opening your email app. Review and send the email to submit your request. If no app opens, copy the draft below. Nothing has been sent by this website.';
    root.location.href = result.href;
  });
  copy.addEventListener('click', async function () {
    update();
    try {
      await root.navigator.clipboard.writeText(preview.value);
      manual.hidden = true;
      status.textContent = 'Request copied. Paste it into an email to support@unclocked.app and send it when ready.';
    } catch (_) {
      manual.hidden = false;
      details.open = true;
      preview.focus();
      preview.select();
      status.textContent = 'Automatic copying is unavailable. The complete draft is selected for you to copy manually.';
    }
  });
  update();
})(typeof window !== 'undefined' ? window : globalThis);
