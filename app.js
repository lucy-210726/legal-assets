// ════════════════════════════════════════════════════════════
//  커스텀 Alert / Confirm 모달
// ════════════════════════════════════════════════════════════
function showAlert(msg, { title='', icon='ℹ️', onClose } = {}) {
const overlay = document.getElementById('alert-modal-overlay');
document.getElementById('alert-modal-icon').textContent  = icon;
document.getElementById('alert-modal-title').textContent = title;
document.getElementById('alert-modal-msg').textContent   = msg;
overlay.style.display = 'flex';
overlay._onClose = onClose || null;
}
function closeAlertModal() {
const overlay = document.getElementById('alert-modal-overlay');
overlay.style.display = 'none';
if (typeof overlay._onClose === 'function') overlay._onClose();
overlay._onClose = null;
}
let _confirmModalCallback = null;
function showConfirm(msg, { title='', icon='❓', type='default', okLabel='확인', cancelLabel='취소', onOk, onCancel } = {}) {
const overlay   = document.getElementById('confirm-modal-overlay');
const okBtn     = document.getElementById('confirm-modal-ok-btn');
const cancelBtn = document.getElementById('confirm-modal-cancel-btn');
document.getElementById('confirm-modal-icon').textContent  = icon;
document.getElementById('confirm-modal-title').textContent = title;
document.getElementById('confirm-modal-msg').textContent   = msg;
okBtn.textContent     = okLabel;
cancelBtn.textContent = cancelLabel;
okBtn.style.background = type === 'danger' ? 'var(--red)' : 'var(--ink)';
overlay.style.display  = 'flex';
_confirmModalCallback  = { onOk: onOk || null, onCancel: onCancel || null };
}
function closeConfirmModal(isOk) {
document.getElementById('confirm-modal-overlay').style.display = 'none';
const cb = _confirmModalCallback;
_confirmModalCallback = null;
if (isOk  && cb && typeof cb.onOk     === 'function') cb.onOk();
if (!isOk && cb && typeof cb.onCancel === 'function') cb.onCancel();
}
document.addEventListener('keydown', function(e) {
  // ── ESC 처리 ──
  if (e.key === 'Escape') {
    if (document.getElementById('ref-modal-overlay').style.display === 'flex') { closeRefModal(); return; }
    if (document.getElementById('alert-modal-overlay').style.display === 'flex') { closeAlertModal(); return; }
    if (document.getElementById('confirm-modal-overlay').style.display === 'flex') { closeConfirmModal(false); return; }
    if (document.getElementById('confirm-popup-overlay').style.display === 'flex') { closeConfirmPopup(); return; }
    var activePage = document.querySelector('.page.active');
    if (!activePage) return;
    var pageId = activePage.id.replace('page-','');
    if (pageId !== 'home') goBack(pageId);
    return;
  }
  // ── Enter 처리 ──
  if (e.key === 'Enter') {
    if (e.target && e.target.tagName === 'TEXTAREA') return;
    if (document.getElementById('alert-modal-overlay').style.display === 'flex') {
      e.preventDefault();
      closeAlertModal();
      return;
    }
  // ✅ 추가: 등록 완료 화면에서 Enter → 새로고침
  var unregOverlay = document.getElementById('unregistered-overlay');
  if (unregOverlay && unregOverlay.style.display === 'flex' && unregOverlay.querySelector('h3') && unregOverlay.querySelector('h3').textContent === '등록 요청 완료') {
    e.preventDefault();
    location.reload();
    return;
  }
}
});
function formatNumberInput(el) {
  var pos = el.selectionStart;
  var oldLen = el.value.length;
  var raw = el.value.replace(/[^0-9.]/g, '');
  // 소수점이 2개 이상이면 첫 번째만 유지
  var parts = raw.split('.');
  if (parts.length > 2) raw = parts[0] + '.' + parts.slice(1).join('');
  // 정수부에만 3자리 쉼표 적용
  var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  el.value = parts.length > 1 ? intPart + '.' + parts[1] : intPart;
  var newLen = el.value.length;
  el.setSelectionRange(pos + (newLen - oldLen), pos + (newLen - oldLen));
}
// ════════════════════════════════════════════════════════════
//  승인/반려 팝업
// ════════════════════════════════════════════════════════════
let _pendingConfirmRow = null;
let _popupAction = null;
function confirmRow(rowNum) {
var pool = document.getElementById('list-search').value.trim() ? filtered : allRows;
var row  = pool.find(function(r){return r.rowNum === rowNum;});
if (!row) return;
_pendingConfirmRow = row;
_popupAction = null;
document.getElementById('popup-contract-label').textContent = row.counterParty + ' _ ' + row.contractName;
document.getElementById('popup-contract-sub').innerHTML = '관리번호: ' + row.managementNo + '<br>기안자: ' + row.drafter;
document.getElementById('popup-reject-area').style.display  = 'none';
document.getElementById('popup-reject-reason').value        = '';
document.getElementById('popup-confirm-btn').disabled       = true;
document.getElementById('popup-confirm-btn').textContent    = '확인';
document.getElementById('popup-confirm-btn').style.opacity  = '0.4';
document.getElementById('popup-confirm-btn').style.cursor   = 'not-allowed';
resetPopupBtnStyle('popup-approve-btn');
resetPopupBtnStyle('popup-reject-btn');
document.getElementById('confirm-popup-overlay').style.display = 'flex';
}
function resetPopupBtnStyle(id) {
var btn = document.getElementById(id);
btn.style.borderColor = 'var(--border)';
btn.style.background  = 'var(--white)';
btn.style.color       = 'var(--text-muted)';
}
function popupSelectAction(action) {
_popupAction = action;
var approveBtn = document.getElementById('popup-approve-btn');
approveBtn.style.borderColor = action==='approve' ? '#1a6b42' : 'var(--border)';
approveBtn.style.background  = action==='approve' ? 'var(--green-light)' : 'var(--white)';
approveBtn.style.color       = action==='approve' ? 'var(--green)' : 'var(--text-muted)';
var rejectBtn = document.getElementById('popup-reject-btn');
rejectBtn.style.borderColor  = action==='reject' ? 'var(--red)' : 'var(--border)';
rejectBtn.style.background   = action==='reject' ? '#fff0ef' : 'var(--white)';
rejectBtn.style.color        = action==='reject' ? 'var(--red)' : 'var(--text-muted)';
document.getElementById('popup-reject-area').style.display = action==='reject' ? 'block' : 'none';
checkPopupReady();
}
function checkPopupReady() {
var btn    = document.getElementById('popup-confirm-btn');
var reason = document.getElementById('popup-reject-reason').value.trim();
var ready  = _popupAction==='approve' || (_popupAction==='reject' && reason.length > 0);
btn.disabled       = !ready;
btn.style.opacity  = ready ? '1' : '0.4';
btn.style.cursor   = ready ? 'pointer' : 'not-allowed';
}
function closeConfirmPopup() {
document.getElementById('confirm-popup-overlay').style.display = 'none';
_pendingConfirmRow = null;
_popupAction = null;
}
function submitConfirmPopup() {
if (!_pendingConfirmRow || !_popupAction) return;
var row    = _pendingConfirmRow;
var action = _popupAction;
var reason = document.getElementById('popup-reject-reason').value.trim();
var confirmBtn = document.getElementById('popup-confirm-btn');
confirmBtn.disabled = true;
confirmBtn.textContent = '처리 중...';
if (action === 'approve') {
google.script.run.withSuccessHandler(function(result) {
closeConfirmPopup();
if (result && result.ok) {
allRows  = allRows.filter(function(r){return r.rowNum !== row.rowNum;});
filtered = filtered.filter(function(r){return r.rowNum !== row.rowNum;});
renderTable(document.getElementById('list-search').value.trim() ? filtered : allRows);
if (selectedR && selectedR.rowNum === row.rowNum) { selectedR = null; document.getElementById('sel-panel').style.display = 'none'; }
} else {
confirmBtn.disabled = false;
confirmBtn.textContent = '확인';
showAlert((result && result.error) || '알 수 없는 오류가 발생했습니다.', { title:'승인 처리 실패', icon:'❌' });
}
}).withFailureHandler(function(err) {
confirmBtn.disabled = false;
confirmBtn.textContent = '확인';
showAlert(err.message||String(err), { title:'오류', icon:'❌' });
}).confirmContract(row.rowNum);
} else {
google.script.run.withSuccessHandler(function(result) {
closeConfirmPopup();
if (result && result.ok) {
var tRow = allRows.find(function(r){return r.rowNum === row.rowNum;});
if (tRow) { tRow.status = ''; tRow.confirmed = ''; }
var tFiltered = filtered.find(function(r){return r.rowNum === row.rowNum;});
if (tFiltered) { tFiltered.status = ''; tFiltered.confirmed = ''; }
renderTable(document.getElementById('list-search').value.trim() ? filtered : allRows);
if (selectedR && selectedR.rowNum === row.rowNum) { selectedR = null; document.getElementById('sel-panel').style.display = 'none'; }
} else {
confirmBtn.disabled = false;
confirmBtn.textContent = '확인';
showAlert((result && result.error) || '알 수 없는 오류가 발생했습니다.', { title:'반려 처리 실패', icon:'❌' });
}
}).withFailureHandler(function(err) {
confirmBtn.disabled = false;
confirmBtn.textContent = '확인';
showAlert(err.message||String(err), { title:'오류', icon:'❌' });
}).rejectContract(row.rowNum, reason);
}
}

// ════════════════════════════════════════════════════════════
//  SUBMIT STATE
// ════════════════════════════════════════════════════════════
var allRows = [], filtered = [], selectedR = null;
var partyClass = function(p) { return ({'IGAW':'party-igaw','ADP':'party-adp','DF':'party-df','DT':'party-dt'})[String(p).toUpperCase()] || 'party-igaw'; };
var esc = function(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
function fmtDateTimeKo(v) {
if (!v) return '';
var d = v instanceof Date ? v : new Date(String(v).trim());
if (isNaN(d.getTime())) return String(v);
var yyyy = d.getFullYear(), mm = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0');
var h = d.getHours(); var min = String(d.getMinutes()).padStart(2,'0'), ampm = h < 12 ? '오전' : '오후';
h = h % 12 || 12;
return yyyy+'-'+mm+'-'+dd+' '+ampm+' '+h+'시 '+min+'분';
}
var _initialLoadDone = false;
function initSubmitData() {
selectedR = null;
document.getElementById('sel-panel').style.display = 'none';
fetchContractData();
}
function refreshContractList() {
selectedR = null;
document.getElementById('sel-panel').style.display = 'none';
fetchContractData();
}
function fetchContractData() {
renderSkeleton();
google.script.run.withSuccessHandler(function(rows) {
if (Array.isArray(rows)) { allRows = rows; _initialLoadDone = true; }
renderTable(allRows);
autoSelectSubmitRowFromUrl();
}).withFailureHandler(function() {
try { if (Array.isArray(CONTRACT_SHEET_DATA)) allRows = CONTRACT_SHEET_DATA; } catch(e) { allRows = []; }
renderTable(allRows);
}).getContractRows();
}
function renderSkeleton() {
var sk = function(){ return '<tr><td></td><td><span class="skel" style="width:55px"></span></td><td><span class="skel" style="width:110px"></span></td><td class="hide-mobile"><span class="skel" style="width:88px"></span></td><td><span class="skel" style="width:150px"></span></td><td class="hide-mobile"><span class="skel" style="width:80px"></span></td><td class="hide-mobile"><span class="skel" style="width:80px"></span></td><td class="hide-mobile"><span class="skel" style="width:52px"></span></td><td><span class="skel" style="width:55px"></span></td></tr>'; };
document.getElementById('ct-tbody').innerHTML = sk()+sk()+sk();
document.getElementById('list-count').textContent = '로드 중...';
}
function formatMgmtNo(val) {
if (!val) return '';
var match = val.match(/^(.*?)\s*(\(.*\))\s*$/);
if (match) return esc(match[1].trim()) + '<br><span style="color:var(--text-muted);">' + esc(match[2]) + '</span>';
return esc(val);
}
function renderTable(rows) {
var tbody = document.getElementById('ct-tbody');
var submittedCount = rows.filter(function(r){ return r.status === '제출완료'; }).length;
var pendingCount   = rows.length - submittedCount;
var countText = '미제출 '+pendingCount+'건';
if (submittedCount > 0) countText += ' · 제출완료(미확인) '+submittedCount+'건';
document.getElementById('list-count').textContent = countText;
if (!rows.length) { tbody.innerHTML = '<tr><td colspan="10"><div class="list-empty"><div class="empty-icon">📭</div><p>미제출 계약이 없습니다.</p></div></td></tr>'; return; }
var isLegal = IS_LEGAL_TEAM === 'true';
tbody.innerHTML = rows.map(function(r) {
var isDone    = r.status === '제출완료';
var rowClick  = isDone ? '' : 'onclick="selectRow('+r.rowNum+')"';
var radioCell = isDone ? '<td class="col-radio"></td>' : '<td class="col-radio"><input type="radio" class="row-radio" name="ct-row" '+(selectedR&&selectedR.rowNum===r.rowNum?'checked':'')+' onclick="event.stopPropagation();selectRow('+r.rowNum+')"></td>';
var statusCell  = '<td class="col-status"><span class="status-badge '+(isDone?'status-done':'status-none')+'">'+(r.status||'미제출')+'</span></td>';
var confirmCell = '<td class="col-confirm hide-mobile">'+(isDone && isLegal ? '<button class="btn-confirm" onclick="event.stopPropagation();confirmRow('+r.rowNum+')">확인</button>' : '')+'</td>';
return '<tr data-rn="'+r.rowNum+'" '+rowClick+' class="'+((selectedR&&selectedR.rowNum===r.rowNum)?'selected':'')+(isDone?' row-submitted':'')+'">'+radioCell+'<td class="col-party"><span class="party-badge '+partyClass(r.contractParty)+'">'+r.contractParty+'</span></td><td class="col-counter">'+esc(r.counterParty)+'</td><td class="col-mgmt hide-mobile">'+formatMgmtNo(r.managementNo)+'</td><td class="col-name">'+esc(r.contractName)+'</td><td class="col-date hide-mobile">'+(r.startDate||'\u2014')+'</td><td class="col-date hide-mobile">'+(r.endDate||'\u2014')+'</td><td class="col-drafter hide-mobile">'+esc(r.drafter)+'</td>'+statusCell+confirmCell+'</tr>';
}).join('');
}
function filterList() {
var q = document.getElementById('list-search').value.trim().toLowerCase();
filtered = q ? allRows.filter(function(r){ return r.contractName.toLowerCase().includes(q)||r.counterParty.toLowerCase().includes(q)||r.managementNo.toLowerCase().includes(q)||r.drafter.toLowerCase().includes(q); }) : allRows;
renderTable(filtered);
}
function selectRow(rowNum) {
var pool = document.getElementById('list-search').value.trim() ? filtered : allRows;
selectedR = pool.find(function(r){ return r.rowNum === rowNum; }) || null;
renderTable(pool);
if (selectedR) renderSelPanel();
}
function clearSel() {
selectedR = null;
var pool = document.getElementById('list-search').value.trim() ? filtered : allRows;
renderTable(pool);
document.getElementById('sel-panel').style.display = 'none';
}
function renderSelPanel() {
var r = selectedR;
var fields = [{lbl:'계약당사자',val:r.contractParty,isParty:true},{lbl:'계약상대방',val:r.counterParty},{lbl:'관리번호',val:r.managementNo,accent:true},{lbl:'계약명',val:r.contractName},{lbl:'계약 시작일',val:r.startDate||'\u2014'},{lbl:'계약 종료일',val:r.endDate||'\u2014'},{lbl:'기안자',val:r.drafter}];
document.getElementById('sel-grid').innerHTML = fields.map(function(f){ return '<div class="sel-item"><div class="sel-lbl">'+f.lbl+'</div><div class="sel-val'+(f.accent?' accent':'')+'">'+(f.isParty ? '<span class="party-badge '+partyClass(f.val)+'">'+esc(f.val)+'</span>' : esc(f.val))+'</div></div>'; }).join('');
document.getElementById('fr-name').textContent = r.contractParty+'_ '+r.counterParty+'_ '+r.startDate+' '+r.contractName+' .pdf';
var items = document.querySelectorAll('#sel-grid .sel-item');
var total = items.length, cols = 3, lastRowStart = total - ((total % cols) || cols);
items.forEach(function(item, i){ item.classList.toggle('last-row', i >= lastRowStart); });
var panel = document.getElementById('sel-panel');
panel.style.display = 'block';
setTimeout(function(){ panel.scrollIntoView({behavior:'smooth',block:'nearest'}); }, 50);
}
var selectedFile = null;
function handleFileDrop(e) { e.preventDefault(); document.getElementById('upload-zone').classList.remove('drag'); var file = e.dataTransfer.files[0]; if (file) setFile(file); }
function handleFileSelect(e) { var file = e.target.files[0]; if (file) setFile(file); e.target.value = ''; }
function setFile(file) {
if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) { showAlert('PDF 파일만 첨부 가능합니다.', {title:'파일 형식 오류',icon:'⚠️'}); return; }
if (file.size > 50*1024*1024) { showAlert('파일 크기가 50MB를 초과합니다.', {title:'파일 크기 초과',icon:'⚠️'}); return; }
selectedFile = file;
document.getElementById('upload-zone').style.display  = 'none';
document.getElementById('file-selected').style.display = 'flex';
document.getElementById('fs-name').textContent = file.name;
document.getElementById('fs-size').textContent = (file.size/1024/1024).toFixed(2) + ' MB';
document.getElementById('submit-pdf-btn').disabled = false;
}
function removeFile() {
selectedFile = null;
document.getElementById('upload-zone').style.display   = 'block';
document.getElementById('file-selected').style.display = 'none';
document.getElementById('submit-pdf-btn').disabled = true;
}

async function submitPDF() {
if (!selectedR || !selectedFile) return;
var btn = document.getElementById('submit-pdf-btn');
btn.disabled = true; btn.textContent = '업로드 중...';
var prog = document.getElementById('upload-progress');
prog.style.display = 'block'; setProgress(5, '업로드 준비 중...');
try {
var freshToken = await new Promise(function(resolve){ google.script.run.withSuccessHandler(resolve).withFailureHandler(function(){resolve(OAUTH_TOKEN);}).getFreshToken(); });
var activeToken = freshToken || OAUTH_TOKEN;
setProgress(10, '드라이브 연결 중...');
var initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {method:'POST',headers:{'Authorization':'Bearer '+activeToken,'Content-Type':'application/json','X-Upload-Content-Type':'application/pdf','X-Upload-Content-Length':selectedFile.size},body:JSON.stringify({name:selectedFile.name,mimeType:'application/pdf'})});
if (!initRes.ok) throw new Error('Drive 세션 시작 실패: '+initRes.status);
var uploadUrl = initRes.headers.get('Location');
if (!uploadUrl) throw new Error('업로드 URL을 받지 못했습니다.');
setProgress(20, '파일 업로드 중...');
var fileId;
if (selectedFile.size > 5*1024*1024) { fileId = await resumableChunkUpload(uploadUrl, selectedFile, activeToken); }
else {
var uploadRes = await fetch(uploadUrl, {method:'PUT',headers:{'Content-Type':'application/pdf','Content-Length':selectedFile.size},body:selectedFile});
if (!uploadRes.ok && uploadRes.status !== 200) throw new Error('파일 업로드 실패: '+uploadRes.status);
fileId = (await uploadRes.json()).id;
}
if (!fileId) throw new Error('파일 ID를 받지 못했습니다.');
setProgress(85, '시트 업데이트 중...');
var r = selectedR;
await new Promise(function(resolve, reject) {
google.script.run.withSuccessHandler(function(result){ if (result && result.ok) resolve(result); else reject(new Error((result && result.error)||'시트 업데이트 실패')); }).withFailureHandler(function(err){ reject(new Error(err.message||'시트 업데이트 실패')); }).finalizeUpload({fileId:fileId,rowNum:r.rowNum,contractParty:r.contractParty,counterParty:r.counterParty,managementNo:r.managementNo,contractName:r.contractName,startDate:r.startDate||''});
});
setProgress(100, '완료!');
await new Promise(function(res){ setTimeout(res, 500); });
var submittedRowNum = r.rowNum;
allRows  = allRows.filter(function(row){ return row.rowNum !== submittedRowNum; });
filtered = filtered.filter(function(row){ return row.rowNum !== submittedRowNum; });
showAlert('파일이 드라이브에 저장되었습니다.', {title: '제출이 완료되었습니다!',icon: '✅',onClose: function() {selectedR = null; selectedFile = null;document.getElementById('sel-panel').style.display = 'none';document.getElementById('upload-zone').style.display = 'block';document.getElementById('file-selected').style.display = 'none';document.getElementById('upload-progress').style.display = 'none';document.getElementById('submit-pdf-btn').disabled = true;document.getElementById('submit-pdf-btn').textContent = '제출하기 →';document.getElementById('list-search').value = '';refreshContractList();}});
} catch(e) {
setProgress(0,''); prog.style.display='none';
btn.disabled=false; btn.textContent='제출하기 →';
showAlert(e.message, {title:'오류가 발생했습니다',icon:'❌'});
}
}
async function resumableChunkUpload(uploadUrl, file, activeToken) {
var CHUNK = 5*1024*1024; var offset = 0; var fileId = null;
while (offset < file.size) {
var end = Math.min(offset+CHUNK, file.size); var chunk = file.slice(offset, end);
setProgress(Math.round(20+(offset/file.size)*60), '업로드 중... '+Math.round((offset/file.size)*100)+'%');
var res = await fetch(uploadUrl, {method:'PUT',headers:{'Content-Type':'application/pdf','Content-Range':'bytes '+offset+'-'+(end-1)+'/'+file.size},body:chunk});
if (res.status===200||res.status===201) { fileId=(await res.json()).id; break; }
else if (res.status===308) { var range=res.headers.get('Range'); offset=range?parseInt(range.split('-')[1])+1:end; }
else throw new Error('청크 업로드 실패: '+res.status);
}
return fileId;
}
function setProgress(pct, label) {
document.getElementById('up-bar').style.width = pct+'%';
document.getElementById('up-pct').textContent = pct+'%';
document.getElementById('up-status').textContent = label;
}

// ════════════════════════════════════════════════════════════
//  문의 관리
// ════════════════════════════════════════════════════════════
var _inqAll=[], _inqFiltered=[], _selectedInq=null;
function loadInqMgmt() {
_selectedInq=null; document.getElementById('inq-detail-panel').style.display='none';
document.getElementById('inq-list-count').textContent='로드 중...'; renderInqSkeleton();
google.script.run.withSuccessHandler(function(rows){ _inqAll=rows||[]; _inqFiltered=_inqAll; renderInqTable(_inqAll); }).withFailureHandler(function(err){ document.getElementById('inq-tbody').innerHTML='<tr><td colspan="7"><div class="list-empty"><div class="empty-icon">⚠️</div><p>로드 실패: '+esc(err.message||String(err))+'</p></div></td></tr>'; document.getElementById('inq-list-count').textContent='\u2014'; }).getInquiries('all');
}
function renderInqSkeleton() {
var sk=function(){return '<tr><td></td><td><span class="skel" style="width:60px"></span></td><td><span class="skel" style="width:120px"></span></td><td><span class="skel" style="width:200px"></span></td><td class="hide-mobile"><span class="skel" style="width:80px"></span></td><td><span class="skel" style="width:70px"></span></td></tr>';};
document.getElementById('inq-tbody').innerHTML=sk()+sk()+sk();
}
function filterInqTable() {
var q=document.getElementById('inq-search').value.trim().toLowerCase();
_inqFiltered=q?_inqAll.filter(function(r){return r.name.toLowerCase().includes(q)||r.category.toLowerCase().includes(q)||r.title.toLowerCase().includes(q);}):_inqAll;
renderInqTable(_inqFiltered);
}
function renderInqTable(rows) {
var tbody=document.getElementById('inq-tbody');
var pendingCount=rows.filter(function(r){return r.status!=='답변완료'&&r.status!=='진행중';}).length;
var progressCount=rows.filter(function(r){return r.status==='진행중';}).length;
var doneCount=rows.filter(function(r){return r.status==='답변완료';}).length;
var countText='전체 '+rows.length+'건 · 미답변 '+pendingCount+'건';
if(progressCount>0) countText+=' · 진행중 '+progressCount+'건';
countText+=' · 답변완료 '+doneCount+'건';
document.getElementById('inq-list-count').textContent=countText;
if(!rows.length){tbody.innerHTML='<tr><td colspan="7"><div class="list-empty"><div class="empty-icon">📭</div><p>문의 내역이 없습니다.</p></div></td></tr>';return;}
tbody.innerHTML=rows.map(function(r){
var isDone=r.status==='답변완료',isProgress=r.status==='진행중',isSelected=_selectedInq&&_selectedInq.id===r.id;
var badgeClass=isDone?'inq-status-done':isProgress?'inq-status-progress':'inq-status-pending';
var badgeText=isDone?'답변완료':isProgress?'진행중':'미답변';
var assigneeName=r.assignee||'';
return '<tr data-id="'+esc(r.id)+'" onclick="selectInq(\''+esc(r.id)+'\')" class="'+(isSelected?'selected':'')+'"><td class="col-radio"><input type="radio" class="row-radio" name="inq-row" '+(isSelected?'checked':'')+' onclick="event.stopPropagation();selectInq(\''+esc(r.id)+'\')"></td><td class="col-inq-name" style="font-weight:600;">'+esc(r.name)+'<br><span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;">'+esc(r.dept)+'</span></td><td class="col-inq-type" style="text-align:center;">'+esc(r.category)+'</td><td class="col-inq-title" style="font-weight:500;">'+esc(r.title)+'</td><td class="col-inq-date hide-mobile" style="font-size:0.8rem;color:var(--text-muted);text-align:center;">'+esc(fmtDateTimeKo(r.date))+'</td><td class="col-inq-status" style="text-align:center;"><span class="inq-status-badge '+badgeClass+'">'+badgeText+'</span></td><td class="col-inq-assignee hide-mobile" style="font-size:0.82rem;color:var(--text-muted);text-align:center;">'+esc(assigneeName)+'</td></tr>';
}).join('');
}
function selectInq(id) {var pool=_inqFiltered.length?_inqFiltered:_inqAll;_selectedInq=pool.find(function(r){return r.id===id;})||null;renderInqTable(pool);if(_selectedInq) renderInqDetailPanel();}
function clearInqSel() {_selectedInq=null;renderInqTable(_inqFiltered.length?_inqFiltered:_inqAll);document.getElementById('inq-detail-panel').style.display='none';}
function renderInqDetailPanel() {
  var r = _selectedInq;
  var isDone = r.status === '답변완료', isProgress = r.status === '진행중';
  document.getElementById('inq-detail-title').textContent = '[' + r.category + '] ' + r.title;
  var badge = document.getElementById('inq-detail-status-badge');
  badge.textContent = isDone ? '답변완료' : isProgress ? '진행중' : '미답변';
  badge.className = 'inq-status-badge ' + (isDone ? 'inq-status-done' : isProgress ? 'inq-status-progress' : 'inq-status-pending');
  document.getElementById('inq-detail-meta').innerHTML = [
    { lbl: '문의자', val: r.name },
    { lbl: '부서', val: r.dept },
    { lbl: '접수일', val: fmtDateTimeKo(r.date) }
  ].map(function(f) {
    return '<div class="inq-meta-item"><div class="inq-meta-lbl">' + f.lbl + '</div><div class="inq-meta-val">' + esc(f.val) + '</div></div>';
  }).join('');
  document.getElementById('inq-detail-content').textContent = r.content;

  var answerEl = document.getElementById('inq-detail-answer');
  if (isDone && r.answer) {
    var pureText = stripAttachLines(r.answer), attachHtml = renderAttachLinks(r.answer);
    answerEl.style.display = 'block';
    answerEl.innerHTML = '<div class="inq-answer-view"><div class="inq-content-label">📨 답변 내용</div><div class="inq-answer-meta">답변일: ' + esc(fmtDateTimeKo(r.answerDate || '')) + '</div><div class="inq-content-text">' + esc(pureText) + '</div>' + attachHtml + '</div>';
  } else {
    answerEl.style.display = 'none';
    answerEl.innerHTML = '';
  }

  var replySection = document.getElementById('inq-reply-section');
  var progressSection = document.getElementById('inq-progress-section');
  var doneSection = document.getElementById('inq-done-section');
  replySection.style.display = progressSection.style.display = doneSection.style.display = 'none';
  _attachFiles['inq'] = []; renderAttachList('inq');
  _attachFiles['inq-prog'] = []; renderAttachList('inq-prog');

  if (isDone) {
    doneSection.style.display = 'block';
  } else if (isProgress) {
    // 파란 박스 제거 — 바로 답변 작성 영역 표시
    var progressInfoEl = document.getElementById('inq-progress-info');
    if (progressInfoEl) progressInfoEl.style.display = 'none';
    document.getElementById('inq-progress-textarea').value = '';
    progressSection.style.display = 'block';
    populateAssigneeSelect();

    // ── 진행 취소 버튼 추가 (Legal_Team + 진행중 상태) ──
    var isLegal = IS_LEGAL_TEAM === 'true';
    if (isLegal) {
      var cancelBtnWrap = document.getElementById('inq-cancel-progress-wrap');
      if (!cancelBtnWrap) {
        // 답변 작성 영역 상단에 진행 취소 버튼 삽입
        cancelBtnWrap = document.createElement('div');
        cancelBtnWrap.id = 'inq-cancel-progress-wrap';
        cancelBtnWrap.style.cssText = 'padding:0 28px 12px;';
        cancelBtnWrap.innerHTML =
          '<button id="inq-cancel-progress-btn" class="btn btn-outline-danger" ' +
          'onclick="doCancelInquiryProgress()" ' +
          'style="font-family:var(--font);font-size:0.8rem;font-weight:600;padding:8px 16px;' +
          'border-radius:8px;border:1.5px solid #e74c3c;background:transparent;color:#e74c3c;' +
          'cursor:pointer;white-space:nowrap;">' +
          '↩ 진행 취소</button>';
        progressSection.insertBefore(cancelBtnWrap, progressSection.firstChild);
      } else {
        cancelBtnWrap.style.display = 'block';
      }
    }
  } else {
    replySection.style.display = 'block';
    document.getElementById('inq-reply-textarea').value = '';
    var oldCancelWrap = document.getElementById('inq-cancel-progress-wrap'); if (oldCancelWrap) oldCancelWrap.style.display = 'none';
    var oldStartBtn = document.getElementById('inq-start-btn'); if (oldStartBtn) oldStartBtn.remove();
    if (!document.getElementById('inq-start-btn')) {
      var footer = replySection.querySelector('.inq-reply-footer .btn-row');
      var startBtn = document.createElement('button');
      startBtn.id = 'inq-start-btn';
      startBtn.className = 'btn btn-dark';
      startBtn.textContent = '진행';
      startBtn.onclick = startInquiry;
      footer.insertBefore(startBtn, footer.querySelector('#inq-reply-btn'));
    }
  }

  var panel = document.getElementById('inq-detail-panel');
  panel.style.display = 'block';
  setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
}


// ── doCancelInquiryProgress — 진행 취소 실행 ──
function doCancelInquiryProgress() {
  if (!_selectedInq) return;

  showConfirm(
    '이 문의의 진행을 취소하시겠습니까?\n상태가 "미답변"으로 되돌아갑니다.',
    {
      title: '진행 취소',
      icon: '↩',
      okLabel: '취소하기',
      onOk: function() {
        var btn = document.getElementById('inq-cancel-progress-btn');
        if (btn) { btn.disabled = true; btn.textContent = '처리 중...'; }

        google.script.run
          .withSuccessHandler(function(result) {
            if (result && result.ok) {
              // 로컬 데이터 갱신
              var row = _inqAll.find(function(r) { return r.id === _selectedInq.id; });
              if (row) {
                row.status = '미답변';
                row.assignee = '';
                _selectedInq = row;
              }
              renderInqTable(_inqFiltered.length ? _inqFiltered : _inqAll);
              renderInqDetailPanel();
              showAlert('진행이 취소되었습니다.', { title: '진행 취소 완료', icon: '✅' });
            } else {
              showAlert((result && result.error) || '알 수 없는 오류가 발생했습니다.', { title: '진행 취소 실패', icon: '❌' });
              if (btn) { btn.disabled = false; btn.textContent = '↩ 진행 취소'; }
            }
          })
          .withFailureHandler(function(err) {
            showAlert(err.message || String(err), { title: '오류', icon: '❌' });
            if (btn) { btn.disabled = false; btn.textContent = '↩ 진행 취소'; }
          })
          .cancelInquiryProgress(_selectedInq.id);
      }
    }
  );
}

function populateAssigneeSelect(){
loadLegalMembers(function(members){
var sel = document.getElementById('inq-assignee-select');
if (!sel) return;
var currentName = _selectedInq ? (_selectedInq.assignee || '') : '';
sel.innerHTML = '<option value="">담당자 선택...</option>' +
members.map(function(m) {
var isSelected = (currentName && (m.name === currentName || m.email === currentName));
return '<option value="' + esc(m.email) + '"' + (isSelected ? ' selected' : '') + '>' + esc(m.name) + '</option>';
}).join('');
});
}

// ════════════════════════════════════════════════════════════
//  답변 첨부 파일
// ════════════════════════════════════════════════════════════
var _attachFiles={'inq':[],'inq-prog':[],'inq-form':[]};
function handleAttachSelect(prefix) {
var inputId=prefix==='inq'?'inq-attach-input':prefix==='inq-prog'?'inq-prog-attach-input':'inq-form-attach-input';
var input=document.getElementById(inputId); var files=Array.from(input.files||[]);
input.value='';
files.forEach(function(f){if(f.size>20*1024*1024){ showAlert(f.name+'\n파일 크기가 20MB를 초과합니다.',{title:'파일 크기 초과',icon:'⚠️'}); return; }_attachFiles[prefix].push({file:f,name:f.name,size:f.size,mimeType:f.type||'application/octet-stream'});});
renderAttachList(prefix);
}
function removeAttach(prefix,idx){ _attachFiles[prefix].splice(idx,1); renderAttachList(prefix); }
function renderAttachList(prefix){
var listId=prefix==='inq'?'inq-attach-list':prefix==='inq-prog'?'inq-prog-attach-list':'inq-form-attach-list';
var el=document.getElementById(listId); if(!el) return;
el.innerHTML=_attachFiles[prefix].map(function(a,i){return '<div class="attach-file-item"><span style="font-size:1rem;">📄</span><span class="afi-name">'+esc(a.name)+'</span><span class="afi-size">'+(a.size/1024/1024).toFixed(2)+' MB</span><button class="afi-remove" onclick="removeAttach(\''+prefix+'\','+i+')">✕</button></div>';}).join('');
}
function getExpireStr(){ var d=new Date(),days=0; while(days<3){d.setDate(d.getDate()+1);var dow=d.getDay();if(dow!==0&&dow!==6)days++;} return d.getFullYear().toString()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'); }
async function uploadAttachmentsToDrive(prefix) {
var files=_attachFiles[prefix]; if(!files.length) return [];
var freshToken=await new Promise(function(resolve){ google.script.run.withSuccessHandler(resolve).withFailureHandler(function(){resolve(OAUTH_TOKEN);}).getFreshToken(); });
var activeToken=freshToken||OAUTH_TOKEN;
var expireStr=getExpireStr(), results=[];
for(var i=0;i<files.length;i++){
var a=files[i]; var encodedName='EXPIRE_'+expireStr+'_'+a.name;
try{
var initRes=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',{method:'POST',headers:{'Authorization':'Bearer '+activeToken,'Content-Type':'application/json','X-Upload-Content-Type':a.mimeType,'X-Upload-Content-Length':a.file.size},body:JSON.stringify({name:encodedName})});
if(!initRes.ok) throw new Error('Drive 세션 시작 실패: '+initRes.status);
var uploadUrl=initRes.headers.get('Location');
var uploadRes=await fetch(uploadUrl,{method:'PUT',body:a.file});
if(!uploadRes.ok&&uploadRes.status!==200) throw new Error('업로드 실패: '+uploadRes.status);
var fileId=(await uploadRes.json()).id;
await fetch('https://www.googleapis.com/drive/v3/files/'+fileId+'/permissions',{method:'POST',headers:{'Authorization':'Bearer '+activeToken,'Content-Type':'application/json'},body:JSON.stringify({role:'reader',type:'anyone'})});
results.push({name:a.name,fileId:fileId,expireStr:expireStr,url:'https://drive.google.com/file/d/'+fileId+'/view'});
}catch(e){ showAlert(a.name+' 업로드 실패: '+e.message,{title:'파일 업로드 실패',icon:'❌'}); }
}
return results;
}
function buildAttachText(attachInfos){ if(!attachInfos.length) return ''; return '\n\n\u2500\u2500 첨부 파일 \u2500\u2500\n'+attachInfos.map(function(a){return '[첨부파일] '+a.name+' | 만료: '+a.expireStr.slice(0,4)+'-'+a.expireStr.slice(4,6)+'-'+a.expireStr.slice(6,8)+' | '+a.url;}).join('\n'); }
function stripAttachLines(text){ return (text||'').split('\n').filter(function(l){return !l.startsWith('[첨부파일]')&&l!=='\u2500\u2500 첨부 파일 \u2500\u2500';}).join('\n').trim(); }
function renderAttachLinks(answerText){
var lines=(answerText||'').split('\n').filter(function(l){return l.startsWith('[첨부파일]');});
if(!lines.length) return '';
var today=new Date(); today.setHours(0,0,0,0);
var items=lines.map(function(line){var parts=line.replace('[첨부파일] ','').split(' | ');var name=parts[0]||'',expDateStr=(parts[1]||'').replace('만료: ','').trim(),url=parts[2]||'';var expDate=new Date(expDateStr); expDate.setHours(0,0,0,0);var isExpired=today>expDate,daysLeft=Math.ceil((expDate-today)/86400000);return {name:name,url:url,isExpired:isExpired,daysLeft:daysLeft,expDateStr:expDateStr};});
return '<div class="attach-link-list">'+items.map(function(a){
if(a.isExpired) return '<span class="attach-link-item expired">📄 '+esc(a.name)+'<span class="attach-expire-badge expired-badge">열람 기한 만료</span></span>';
return '<a class="attach-link-item" href="'+esc(a.url)+'" target="_blank" onclick="return checkAttachExpiry(event,\''+esc(a.expDateStr)+'\')">📄 '+esc(a.name)+'<span class="attach-expire-badge">'+(a.daysLeft<=0?'오늘 만료':a.daysLeft===1?'내일 만료':a.daysLeft+'일 후 만료')+'</span></a>';
}).join('')+'</div>';
}
function checkAttachExpiry(e,expDateStr){var today=new Date(); today.setHours(0,0,0,0);var expDate=new Date(expDateStr); expDate.setHours(0,0,0,0);if(today>expDate){ e.preventDefault(); showAlert('열람 기한이 만료된 파일입니다.\n보안상 이유로 더 이상 열람할 수 없습니다.',{title:'열람 기한 만료',icon:'⚠️'}); return false; }return true;}
function startInquiry() {
if(!_selectedInq) return;
var btn=document.getElementById('inq-start-btn');
if(btn){btn.disabled=true;btn.textContent='처리 중...';}
google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var row=_inqAll.find(function(r){return r.id===_selectedInq.id;});if(row){row.status='진행중';row.assignee=result.assignee||USER_EMAIL;_selectedInq=row;}renderInqTable(_inqFiltered.length?_inqFiltered:_inqAll); renderInqDetailPanel();} else { showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'진행 처리 실패',icon:'❌'}); if(btn){btn.disabled=false;btn.textContent='진행';} }}).withFailureHandler(function(err){ showAlert(err.message||String(err),{title:'오류',icon:'❌'}); if(btn){btn.disabled=false;btn.textContent='진행';} }).startInquiry(_selectedInq.id);
}
async function sendInqReply(mode) {
if(!_selectedInq) return;
var prefix=mode==='progress'?'inq-prog':'inq';
var textareaId=mode==='progress'?'inq-progress-textarea':'inq-reply-textarea';
var btnId=mode==='progress'?'inq-progress-reply-btn':'inq-reply-btn';
var answerText=document.getElementById(textareaId).value.trim();
if(!answerText){ showAlert('답변 내용을 입력해주세요.',{title:'입력 필요',icon:'⚠️'}); return; }
var btn=document.getElementById(btnId);
btn.disabled=true; btn.textContent='전송 중...';
try{
var finalAnswer=answerText;
if(_attachFiles[prefix].length>0){btn.textContent='파일 업로드 중...';var attachInfos=await uploadAttachmentsToDrive(prefix);if(attachInfos.length>0) finalAnswer+=buildAttachText(attachInfos);_attachFiles[prefix]=[]; renderAttachList(prefix);}
btn.textContent='전송 중...';
await new Promise(function(resolve,reject){google.script.run.withSuccessHandler(function(result){if(result&&result.ok)resolve(result);else reject(new Error((result&&result.error)||'전송 실패'));}).withFailureHandler(function(err){reject(new Error(err.message||err));}).replyInquiry(_selectedInq.id,finalAnswer,_selectedInq.slackId);});
var row=_inqAll.find(function(r){return r.id===_selectedInq.id;});
if(row){row.status='답변완료';row.answer=finalAnswer;row.answerDate=fmtDateTimeKo(new Date());_selectedInq=row;}
renderInqTable(_inqFiltered.length?_inqFiltered:_inqAll); renderInqDetailPanel();
btn.disabled=false; btn.textContent='답변 전송 →';
}catch(e){ showAlert(e.message,{title:'전송 실패',icon:'❌'}); btn.disabled=false; btn.textContent='답변 전송 →'; }
}

// ════════════════════════════════════════════════════════════
//  검토 요청 현황
// ════════════════════════════════════════════════════════════
var _revAll=[], _revFiltered=[], _selectedRev=null;
function loadReviewMgmt() {
_selectedRev=null;
document.getElementById('rev-detail-panel').style.display='none';
document.getElementById('rev-assignee-wrap-dynamic').innerHTML='';
document.getElementById('rev-list-count').textContent='로드 중...'; renderRevSkeleton();
google.script.run.withSuccessHandler(function(rows){ _revAll=rows||[]; _revFiltered=_revAll; renderRevTable(_revAll); }).withFailureHandler(function(err){ document.getElementById('rev-tbody').innerHTML='<tr><td colspan="8"><div class="list-empty"><div class="empty-icon">⚠️</div><p>로드 실패: '+esc(err.message||String(err))+'</p></div></td></tr>'; document.getElementById('rev-list-count').textContent='\u2014'; }).getReviewRequests('all');
}
function renderRevSkeleton(){
var sk=function(){return '<tr><td></td><td class="hide-mobile"><span class="skel" style="width:80px"></span></td><td><span class="skel" style="width:70px"></span></td><td><span class="skel" style="width:200px"></span></td><td><span class="skel" style="width:70px"></span></td><td class="hide-mobile"><span class="skel" style="width:80px"></span></td></tr>';};
document.getElementById('rev-tbody').innerHTML=sk()+sk()+sk();
}
function filterRevTable(){var q=document.getElementById('rev-search').value.trim().toLowerCase();_revFiltered=q?_revAll.filter(function(r){return r.requesterName.toLowerCase().includes(q)||r.contractName.toLowerCase().includes(q);}):_revAll;renderRevTable(_revFiltered);}
function renderRevTable(rows){
var tbody=document.getElementById('rev-tbody');
var pendingCount=rows.filter(function(r){return !r.status||r.status==='검토대기';}).length;
var progressCount=rows.filter(function(r){return r.status==='검토중'||r.status==='재검토중';}).length;
var repliedCount=rows.filter(function(r){return r.status==='회신완료';}).length;
var agreedCount=rows.filter(function(r){return r.status==='합의완료';}).length;
var doneCount=rows.filter(function(r){return r.status==='검토완료';}).length;
var revCountText='전체 '+rows.length+'건 · 검토대기 '+pendingCount+'건';
if(progressCount>0) revCountText+=' · 검토중 '+progressCount+'건';
if(repliedCount>0) revCountText+=' · 회신완료 '+repliedCount+'건';
if(agreedCount>0) revCountText+=' · 합의완료 '+agreedCount+'건';
revCountText+=' · 검토완료 '+doneCount+'건';
document.getElementById('rev-list-count').textContent=revCountText;
if(!rows.length){tbody.innerHTML='<tr><td colspan="8"><div class="list-empty"><div class="empty-icon">📭</div><p>검토 요청 내역이 없습니다.</p></div></td></tr>';return;}
tbody.innerHTML=rows.map(function(r){
var isDone=r.status==='검토완료', isProgress=r.status==='검토중', isReReviewing=r.status==='재검토중', isAgreed=r.status==='합의완료', isReplied=r.status==='회신완료';
var revBadgeClass=isDone?'rev-status-done':isReReviewing?'rev-status-rereviewing':isProgress?'rev-status-inprogress':isReplied?'rev-status-replied':isAgreed?'rev-status-agreed':'rev-status-pending';
var isSelected=_selectedRev&&_selectedRev.id===r.id;
var progressName=r.confirmedBy||'';
var partyLabel = r.contractParty || '\u2014';
var revTypeLabel = r.contractType === 'nonstandard' ? '비표준' : '표준';
return '<tr data-id="'+esc(r.id)+'" onclick="selectRev(\''+esc(r.id)+'\')" class="'+(isSelected?'selected':'')+'"><td class="col-radio"><input type="radio" class="row-radio" name="rev-row" '+(isSelected?'checked':'')+' onclick="event.stopPropagation();selectRev(\''+esc(r.id)+'\')"></td><td class="col-rev-requester" style="font-weight:600;text-align:center;">'+esc(r.requesterName)+'</td><td style="text-align:center;">'+esc(partyLabel)+'</td><td style="text-align:center;">'+revTypeLabel+'</td><td class="col-rev-name" style="font-weight:500;">'+esc(r.contractName)+'</td><td class="col-rev-date hide-mobile" style="font-size:0.8rem;color:var(--text-muted);text-align:center;">'+esc(fmtDateTimeKo(r.requestDate))+'</td><td class="col-rev-status" style="text-align:center;"><span class="rev-status-badge '+revBadgeClass+'">'+esc(r.status||'검토대기')+'</span></td><td class="col-rev-confirmed hide-mobile" style="font-size:0.82rem;color:var(--text-muted);text-align:center;">'+esc(progressName)+'</td></tr>';
}).join('');
}
function selectRev(id){var pool=_revFiltered.length?_revFiltered:_revAll;_selectedRev=pool.find(function(r){return r.id===id;})||null;renderRevTable(pool); if(_selectedRev) renderRevDetailPanel();}
function clearRevSel(){_selectedRev=null;renderRevTable(_revFiltered.length?_revFiltered:_revAll);document.getElementById('rev-detail-panel').style.display='none';document.getElementById('rev-assignee-wrap-dynamic').innerHTML='';}

// ── 검토 의견 첨부파일 상태 ──
var _revReplyAttachFiles = [];

// ── 이름에서 한글만 추출 (영어이름 제거) ──
// 형식 예: "Lucy.김루시" → "김루시", "Kim.김법무" → "김법무"
// 온점(.) 뒤가 한글이름
function koreanNameOnly(name) {
  if (!name) return '';
  // "영어.한글" 형식 → 온점 뒤 한글 부분 추출
  if (name.indexOf('.') >= 0) {
    var parts = name.split('.');
    for (var i = parts.length - 1; i >= 0; i--) {
      var part = parts[i].trim();
      if (/[가-힣]/.test(part)) return part;
    }
  }
  // 괄호 안 영어 제거
  var cleaned = name.replace(/\s*[\(\(].*?[\)\)]\s*/g, '').trim();
  // 영어 단어 제거
  cleaned = cleaned.replace(/[A-Za-z\-\.]+/g, '').trim();
  return cleaned || name.trim();
}

// ── renderRevDetailPanel 확장 교체본 ──
// 변경점: 파일 목록 로드, 상태별 액션 버튼, Proxy_Link 표시
function renderRevDetailPanel() {
  var r = _selectedRev;
  var isDone = r.status === '검토완료', isProgress = r.status === '검토중', isAgreed = r.status === '합의완료';
  var isReplied = r.status === '회신완료';
  var isReReviewing = r.status === '재검토중';
  var isPending = !r.status || r.status === '검토대기';
  var isLegal = IS_LEGAL_TEAM === 'true';

  document.getElementById('rev-detail-title').textContent = r.contractName;
  var badge = document.getElementById('rev-detail-status-badge');
  badge.textContent = r.status || '검토대기';
  badge.className = 'rev-status-badge ' + (isDone ? 'rev-status-done' : isProgress ? 'rev-status-inprogress' : isReReviewing ? 'rev-status-rereviewing' : isReplied ? 'rev-status-replied' : isAgreed ? 'rev-status-agreed' : 'rev-status-pending');

  document.getElementById('rev-detail-meta').innerHTML = [
    { lbl: '요청자', val: r.requesterName },
    { lbl: '요청일', val: fmtDateTimeKo(r.requestDate) },
    { lbl: '요청 이메일', val: r.requesterEmail }
  ].map(function(f) { return '<div class="rev-meta-item"><div class="rev-meta-lbl">' + f.lbl + '</div><div class="rev-meta-val">' + esc(f.val) + '</div></div>'; }).join('');

  var opinionWrap = document.getElementById('rev-opinion-wrap');
  if (r.opinion) { opinionWrap.style.display = 'block'; document.getElementById('rev-detail-opinion').textContent = r.opinion; } else { opinionWrap.style.display = 'none'; }

  // ── Proxy_Link 기반 파일 링크 ──
  var fileWrap = document.getElementById('rev-file-wrap');
  if (r.fileUrl || r.reviewCaseFolderId) {
    fileWrap.style.display = 'block';
    var fileLink = document.getElementById('rev-file-link');
    fileLink.href = '#';
fileLink.textContent = '📥 계약서 검토 파일 열기 →';
fileLink.onclick = function(e) {
  e.preventDefault();
  var originalText = fileLink.textContent;
  fileLink.textContent = '불러오는 중...';

  google.script.run
    .withSuccessHandler(function(result) {
      fileLink.textContent = originalText;
      if (result && result.ok && result.downloadUrl) {
        window.location.href = result.downloadUrl;  // 새 탭 없이 현재 창에서 바로 다운로드
      } else {
        showAlert((result && result.error) || '파일을 찾을 수 없습니다.', { title: '다운로드 실패', icon: '❌' });
      }
    })
    .withFailureHandler(function(err) {
      fileLink.textContent = originalText;
      showAlert(err.message || String(err), { title: '오류', icon: '❌' });
    })
    .getLatestReviewFileUrl(r.id);

  return false;
};
  } else { fileWrap.style.display = 'none'; }

  var confirmedWrap = document.getElementById('rev-confirmed-wrap');
  if (isDone) { confirmedWrap.style.display = 'block'; document.getElementById('rev-confirmed-text').textContent = '✅ 검토완료 · ' + (fmtDateTimeKo(r.confirmedAt) || '') + ' · 진행자: ' + (r.confirmedBy || ''); } else { confirmedWrap.style.display = 'none'; }

  // ── 수신자/참조자 표시 (법무팀에게만) ──
  var recipientInfoEl = document.getElementById('rev-recipient-info');
  if (recipientInfoEl) {
    if (isLegal && (r.toList || r.ccList)) {
      var toArr = [], ccArr = [];
      try { toArr = JSON.parse(r.toList || '[]'); } catch(e) {}
      try { ccArr = JSON.parse(r.ccList || '[]'); } catch(e) {}
      if (toArr.length > 0 || ccArr.length > 0) {
        var html = '';
        if (toArr.length > 0) html += '<span style="font-weight:600;color:var(--ink-3);">추가 수신(TO):</span> ' + toArr.map(function(e) { return esc(e); }).join(', ');
        if (toArr.length > 0 && ccArr.length > 0) html += '<br>';
        if (ccArr.length > 0) html += '<span style="font-weight:600;color:var(--ink-3);">참조(CC):</span> ' + ccArr.map(function(e) { return esc(e); }).join(', ');
        recipientInfoEl.innerHTML = html;
        recipientInfoEl.style.display = 'block';
      } else { recipientInfoEl.style.display = 'none'; }
    } else { recipientInfoEl.style.display = 'none'; }
  }

  // ── 파일 목록 로드 (Review_Case_Folder) ──
  var filesWrap = document.getElementById('rev-files-wrap');
  if (filesWrap) {
    if (r.reviewCaseFolderId) {
      filesWrap.style.display = 'block';
      loadReviewFiles(r.id);
    } else {
      filesWrap.style.display = 'none';
    }
  }

  // ── 진행자 변경 영역 ──
  var dynWrap = document.getElementById('rev-assignee-wrap-dynamic');
  if ((isProgress || isReReviewing || isReplied) && isLegal) {
    dynWrap.innerHTML = '<div style="padding:0 28px 16px;"><div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--surface);border:1px solid var(--border);border-radius:10px;"><span style="font-family:var(--font);font-size:0.82rem;font-weight:600;color:var(--ink-3);white-space:nowrap;">👤 진행자 변경</span><select id="rev-assignee-select" style="flex:1;font-family:var(--font);font-size:0.85rem;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;background:var(--white);color:var(--text);"><option value="">진행자 선택...</option></select><button onclick="doChangeRevAssignee()" style="font-family:var(--font);font-size:0.8rem;font-weight:600;padding:8px 16px;border-radius:8px;border:1.5px solid var(--gold);background:transparent;color:var(--gold);cursor:pointer;white-space:nowrap;">변경</button></div></div>';
    populateRevAssigneeSelect();
  } else { dynWrap.innerHTML = ''; }

  // ── 상태별 액션 버튼 렌더링 ──
  renderRevActionButtons(r, isLegal);

  // ── 검토 의견 회신 이력 ──
  var historyWrap = document.getElementById('rev-reply-history-wrap');
  if (historyWrap) {
    if (isLegal && !isPending) { historyWrap.style.display = 'block'; loadRevReplyHistory(r.id); }
    else { historyWrap.style.display = 'none'; }
  }

  // ── 검토 의견 작성 섹션 (법무팀 + 검토중/재검토중/합의완료) ──
  var replySection = document.getElementById('rev-reply-section');
  if (replySection) {
    if (isLegal && (isProgress || isReReviewing || isReplied || isAgreed)) {
      replySection.style.display = 'block';
      var assigneeName = koreanNameOnly(r.confirmedBy || USER_NAME || '');
      var requesterShort = koreanNameOnly(r.requesterName || '담당자');
      var defaultTemplate = requesterShort + '님, 안녕하세요.\n법무실 ' + assigneeName + '입니다.\n\n\n\n감사합니다.\n' + assigneeName + ' 드림.';
      document.getElementById('rev-reply-textarea').value = defaultTemplate;
      var ta = document.getElementById('rev-reply-textarea');
      var cursorPos = defaultTemplate.indexOf('\n\n\n');
      if (cursorPos >= 0) { ta.focus(); ta.setSelectionRange(cursorPos + 1, cursorPos + 1); }
      _revReplyAttachFiles = [];
      renderRevReplyAttachList();
    } else { replySection.style.display = 'none'; }
  }

  // ── 하단 버튼 ──
  var foot = document.getElementById('rev-detail-foot');
  var confirmBtn = document.getElementById('rev-confirm-btn');
  ['rev-start-btn', 'rev-agree-btn'].forEach(function(bid) { var b = document.getElementById(bid); if (b) b.remove(); });

  if (isPending && isLegal) {
    var startBtn = document.createElement('button');
    startBtn.id = 'rev-start-btn'; startBtn.className = 'btn btn-dark'; startBtn.textContent = '▶ 검토 시작';
    startBtn.onclick = doStartReview;
    foot.insertBefore(startBtn, confirmBtn);
    confirmBtn.style.display = 'none';
  } else if ((isProgress || isReReviewing || isReplied) && !isLegal && r.requesterEmail === USER_EMAIL) {
    var agreeBtn = document.createElement('button');
    agreeBtn.id = 'rev-agree-btn'; agreeBtn.className = 'btn btn-gold'; agreeBtn.textContent = '✅ 합의 완료';
    agreeBtn.onclick = doAgreeReview;
    foot.insertBefore(agreeBtn, confirmBtn);
    confirmBtn.style.display = 'none';
  } else { confirmBtn.style.display = 'none'; }

  var panel = document.getElementById('rev-detail-panel');

  // ── 후속조치 표시 (검토완료 상태) ──
var revNextActionWrap = document.getElementById('rev-next-action-wrap');
if (!revNextActionWrap) {
  revNextActionWrap = document.createElement('div');
  revNextActionWrap.id = 'rev-next-action-wrap';
  var revDetailBody = document.querySelector('#rev-detail-panel .rev-detail-body');
  if (revDetailBody) revDetailBody.appendChild(revNextActionWrap);
}
if (r.status === '검토완료' && r.nextAction) {
  var actionUrl = '';
  if (r.nextAction === '일반품의서' || r.nextAction === '전자계약품의') {
    actionUrl = 'https://wf.tigrison.com/enovator/gswf/webpage/approvalmain/mainform.aspx';
  } else if (r.nextAction === 'ERP 등록 및 계약등록/변경품의') {
    var party = (r.contractParty || '').toUpperCase();
    actionUrl = party === 'ADP'
      ? 'https://igaworks.operations.dynamics.com/?cmp=adp&mi=defaultdashboard'
      : 'https://igaworks.operations.dynamics.com/?cmp=IGA&mi=DefaultDashboard';
  }
  revNextActionWrap.style.display = 'block';
  revNextActionWrap.innerHTML =
    '<div style="margin-top:16px;padding:16px;border:1.5px solid var(--gold);border-radius:12px;background:var(--gold-dim);">' +
    '<div style="font-family:var(--font);font-size:0.78rem;font-weight:700;color:var(--gold);margin-bottom:8px;">📋 후속 조치</div>' +
    '<div style="font-size:0.85rem;color:var(--ink);">' + esc(r.nextAction) + '</div>' +
    '</div>';
} else {
  revNextActionWrap.style.display = 'none';
}
  panel.style.display = 'block';
  setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
}


// ── 상태별 액션 버튼 렌더링 ──
function renderRevActionButtons(r, isLegal) {
  var wrap = document.getElementById('rev-action-buttons-wrap');
  if (!wrap) return;

  var isProgress = r.status === '검토중';
  var isReReviewing = r.status === '재검토중';
  var isReplied = r.status === '회신완료';
  var isAgreed = r.status === '합의완료';
  var isPending = !r.status || r.status === '검토대기';
  var isRequester = r.requesterEmail === USER_EMAIL;

  var btns = '';

  if (isProgress && isLegal) {
    // 검토중: Legal_Team → [회신완료] [진행 취소]
    btns += '<button class="btn btn-ghost" onclick="doCancelReview()" style="font-size:0.84rem;padding:9px 20px;border-color:#e74c3c;color:#e74c3c;">↩ 진행 취소</button>';
  } else if (isReReviewing && isLegal) {
    // 재검토중: Legal_Team → [회신완료] [진행 취소]
    btns += '<button class="btn btn-ghost" onclick="doCancelReview()" style="font-size:0.84rem;padding:9px 20px;border-color:#e74c3c;color:#e74c3c;">↩ 진행 취소</button>';
  } else if (isReplied && isRequester && !isLegal) {
    // 회신완료: Requester → [합의완료] [재검토 요청]
    btns += '<button class="btn btn-gold" onclick="doAgreeReview()" style="font-size:0.84rem;padding:9px 20px;">✅ 합의완료</button>';
    btns += '<button class="btn btn-ghost" onclick="doRequestReReview()" style="font-size:0.84rem;padding:9px 20px;">🔄 재검토 요청</button>';
  } else if (isAgreed && isLegal) {
    // 합의완료: Legal_Team → [검토완료]
    btns += '<button class="btn btn-gold" onclick="doFinalizeReview()" style="font-size:0.84rem;padding:9px 20px;">✅ 검토완료</button>';
  }

  if (btns) {
    wrap.style.display = 'block';
    wrap.querySelector('div').innerHTML = btns;
  } else {
    wrap.style.display = 'none';
  }
}


// ── 파일 목록 로드 ──
function loadReviewFiles(reviewId) {
  var listEl = document.getElementById('rev-files-list');
  if (!listEl) return;
  listEl.innerHTML = '<span style="color:var(--text-muted);">파일 목록 로드 중...</span>';

  google.script.run
    .withSuccessHandler(function(result) {
      if (result && result.ok && result.files && result.files.length > 0) {
        listEl.innerHTML = renderFileList(result.files);
      } else {
        listEl.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">파일이 없습니다.</span>';
      }
    })
    .withFailureHandler(function() {
      listEl.innerHTML = '<span style="color:var(--text-muted);">파일 목록을 불러올 수 없습니다.</span>';
    })
    .getReviewFiles(reviewId);
}

function renderFileList(files) {
  if (!files || !files.length) return '';

  function getFileIcon(f) {
    switch (f.uploaderRole) {
      case 'legal':     return '⚖️';
      case 'clean':     return '📋';
      case 'final':     return '📑';
      case 'requester': return '👤';
      default:          return '📄';
    }
  }

  var html = files.map(function(f) {
    var icon = getFileIcon(f);
    var latestBadge = f.isLatest ? ' <span style="font-size:0.7rem;background:var(--gold);color:var(--white);padding:1px 6px;border-radius:8px;font-weight:600;">최신</span>' : '';
    var link = f.downloadUrl || (f.fileId ? 'https://drive.google.com/uc?export=download&id=' + f.fileId : '#');
    var roleBadge = f.uploaderRole === 'requester' ? ' <span style="font-size:0.68rem;color:var(--text-muted);">👤 요청자</span>'
                   : f.uploaderRole === 'legal'     ? ' <span style="font-size:0.68rem;color:var(--text-muted);">⚖️ 법무실</span>'
                   : '';
    var dateStr = f.uploadDateLabel ? ' <span style="font-size:0.68rem;color:var(--text-muted);">' + esc(f.uploadDateLabel) + '</span>' : '';

    return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">' +
      '<span style="font-size:1rem;">' + icon + '</span>' +
      '<a href="' + esc(link) + '" target="_blank" style="font-family:var(--font);font-size:0.82rem;color:var(--ink);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(f.name) + '</a>' +
      latestBadge + roleBadge + dateStr +
      '</div>';
  }).join('');

  html += '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;">' +
    '<button class="btn btn-ghost" onclick="downloadReviewFiles()" style="font-size:0.78rem;padding:6px 14px;border-radius:8px;">📥 파일 목록 다운로드</button>' +
    '<button class="btn btn-ghost" onclick="openReviewFolder()" style="font-size:0.78rem;padding:6px 14px;border-radius:8px;">📂 폴더 열기</button>' +
    '</div>';

  return html;
}

// ── 파일 목록 다운로드 (파일별 다운로드 링크 목록 표시) ──
function downloadReviewFiles() {
  if (!_selectedRev) return;

  var listEl = document.getElementById('rev-files-list');
  var originalHtml = listEl ? listEl.innerHTML : '';

  // 로딩 표시
  if (listEl) {
    var downloadArea = listEl.querySelector('#rev-download-area');
    if (downloadArea) { downloadArea.remove(); }
  }

  google.script.run
    .withSuccessHandler(function(result) {
      if (result && result.ok && result.files && result.files.length > 0) {
        var downloadHtml = '<div id="rev-download-area" style="margin-top:12px;padding:12px;background:#f8f9fa;border:1px solid var(--border);border-radius:10px;">' +
          '<div style="font-family:var(--font);font-size:0.78rem;font-weight:700;color:var(--ink-3);margin-bottom:8px;">📥 파일 다운로드</div>';

        result.files.forEach(function(f) {
          downloadHtml += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;">' +
            '<a href="' + esc(f.downloadUrl) + '" target="_blank" download style="font-family:var(--font);font-size:0.8rem;color:var(--gold);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">⬇ ' + esc(f.name) + '</a>' +
            '<span style="font-size:0.7rem;color:var(--text-muted);white-space:nowrap;">' + esc(f.size) + '</span>' +
            '</div>';
        });

        if (result.folderUrl) {
          downloadHtml += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">' +
            '<a href="' + esc(result.folderUrl) + '" target="_blank" style="font-family:var(--font);font-size:0.78rem;color:var(--ink-3);text-decoration:none;">📂 Google Drive 폴더에서 전체 다운로드 →</a>' +
            '</div>';
        }

        downloadHtml += '<button onclick="this.parentElement.remove()" style="margin-top:8px;font-family:var(--font);font-size:0.72rem;padding:4px 10px;border:1px solid var(--border);border-radius:6px;background:var(--white);color:var(--text-muted);cursor:pointer;">닫기</button>';
        downloadHtml += '</div>';

        if (listEl) {
          listEl.insertAdjacentHTML('beforeend', downloadHtml);
        }
      } else {
        showAlert('다운로드할 파일이 없습니다.', { title: '파일 없음', icon: 'ℹ️' });
      }
    })
    .withFailureHandler(function(err) {
      showAlert('파일 목록을 불러올 수 없습니다: ' + (err.message || String(err)), { title: '오류', icon: '❌' });
    })
    .getReviewFileDownloadList(_selectedRev.id);
}


// ── 검토 폴더 열기 ──
function openReviewFolder() {
  if (!_selectedRev || !_selectedRev.reviewCaseFolderId) {
    showAlert('검토 폴더가 없습니다.', { title: '폴더 없음', icon: 'ℹ️' });
    return;
  }
  window.open('https://drive.google.com/drive/folders/' + _selectedRev.reviewCaseFolderId, '_blank');
}


// ── 회신완료 처리 ──
function doCompleteReply() {
  if (!_selectedRev) return;
  showConfirm(
    '회신완료 처리하시겠습니까?\n요청자에게 Slack DM과 이메일로 알림이 발송됩니다.',
    {
      title: '회신완료',
      icon: '📧',
      okLabel: '회신완료',
      onOk: function() {
        google.script.run
          .withSuccessHandler(function(result) {
            if (result && result.ok) {
              var row = _revAll.find(function(r) { return r.id === _selectedRev.id; });
              if (row) { row.status = '회신완료'; _selectedRev = row; }
              renderRevTable(_revFiltered.length ? _revFiltered : _revAll);
              renderRevDetailPanel();
            } else {
              showAlert((result && result.error) || '알 수 없는 오류', { title: '처리 실패', icon: '❌' });
            }
          })
          .withFailureHandler(function(err) {
            showAlert(err.message || String(err), { title: '오류', icon: '❌' });
          })
          .completeReply(_selectedRev.id);
      }
    }
  );
}


// ── 진행 취소 (검토 요청) ──
function doCancelReview() {
  if (!_selectedRev) return;
  showConfirm(
    '진행을 취소하시겠습니까?\n상태가 "검토대기"로 되돌아가고, Editing_Copy가 있으면 삭제됩니다.',
    {
      title: '진행 취소',
      icon: '↩',
      okLabel: '취소하기',
      onOk: function() {
        google.script.run
          .withSuccessHandler(function(result) {
            if (result && result.ok) {
              var row = _revAll.find(function(r) { return r.id === _selectedRev.id; });
              if (row) { row.status = '검토대기'; row.confirmedBy = ''; _selectedRev = row; }
              renderRevTable(_revFiltered.length ? _revFiltered : _revAll);
              renderRevDetailPanel();
              showAlert('진행이 취소되었습니다.', { title: '진행 취소 완료', icon: '✅' });
            } else {
              showAlert((result && result.error) || '알 수 없는 오류', { title: '처리 실패', icon: '❌' });
            }
          })
          .withFailureHandler(function(err) {
            showAlert(err.message || String(err), { title: '오류', icon: '❌' });
          })
          .cancelReview(_selectedRev.id);
      }
    }
  );
}


// ── 재검토 요청 ──
function doRequestReReview() {
  if (!_selectedRev) return;
  showConfirm(
    '재검토를 요청하시겠습니까?\n법무실에 재검토 요청 알림이 발송됩니다.',
    {
      title: '재검토 요청',
      icon: '🔄',
      okLabel: '재검토 요청',
      onOk: function() {
        google.script.run
          .withSuccessHandler(function(result) {
            if (result && result.ok) {
              var row = _revAll.find(function(r) { return r.id === _selectedRev.id; });
              if (row) { row.status = '재검토중'; _selectedRev = row; }
              renderRevTable(_revFiltered.length ? _revFiltered : _revAll);
              renderRevDetailPanel();
              showAlert('재검토 요청이 전달되었습니다.', { title: '재검토 요청 완료', icon: '✅' });
            } else {
              showAlert((result && result.error) || '알 수 없는 오류', { title: '처리 실패', icon: '❌' });
            }
          })
          .withFailureHandler(function(err) {
            showAlert(err.message || String(err), { title: '오류', icon: '❌' });
          })
          .requestReReview(_selectedRev.id, {});
      }
    }
  );
}


// ── 검토완료 처리 ──
function doFinalizeReview() {
  if (!_selectedRev) return;
  if (_selectedRev.status !== '합의완료') {
    showAlert('합의완료 상태에서만 검토완료 처리가 가능합니다.', { title: '처리 불가', icon: '⚠️' });
    return;
  }

  var overlay = document.getElementById('next-action-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'next-action-overlay';
    overlay.style.cssText = 'display:flex;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:600;align-items:center;justify-content:center;';
    overlay.innerHTML =
      '<div style="background:var(--white);border-radius:20px;padding:36px 32px;max-width:440px;width:92%;box-shadow:var(--shadow-lg);font-family:var(--font);text-align:center;max-height:90vh;overflow-y:auto;">' +
      '<div style="font-size:1.5rem;margin-bottom:14px;">📋</div>' +
      '<div style="font-size:1rem;font-weight:700;color:var(--ink);margin-bottom:8px;">후속 조치 선택</div>' +
      '<div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:20px;">요청자가 진행할 후속 조치를 선택해 주세요.</div>' +

      '<div style="text-align:left;margin-bottom:20px;padding:14px;background:var(--surface);border-radius:12px;">' +
        '<div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:10px;">클린본·최종본은 선택 사항입니다. 첨부 없이 진행해도 됩니다.</div>' +

        '<div style="margin-bottom:10px;">' +
          '<label style="display:block;font-size:0.8rem;font-weight:600;color:var(--ink);margin-bottom:4px;">📋 클린본</label>' +
          '<input type="file" id="closeCleanFileInput" style="width:100%;font-size:0.78rem;" onchange="onCloseFileSelect(\'clean\', this)" />' +
          '<div id="closeCleanFileName" style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">첨부된 파일 없음</div>' +
        '</div>' +

        '<div>' +
          '<label style="display:block;font-size:0.8rem;font-weight:600;color:var(--ink);margin-bottom:4px;">📑 최종본</label>' +
          '<input type="file" id="closeFinalFileInput" style="width:100%;font-size:0.78rem;" onchange="onCloseFileSelect(\'final\', this)" />' +
          '<div id="closeFinalFileName" style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">첨부된 파일 없음</div>' +
        '</div>' +
      '</div>' +

      '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">' +
        '<button class="btn btn-ghost" onclick="submitFinalizeWithAction(\'일반품의서\')" style="width:100%;text-align:left;padding:14px 18px;font-size:0.88rem;">📝 일반품의서</button>' +
        '<button class="btn btn-ghost" onclick="submitFinalizeWithAction(\'ERP 등록 및 계약등록/변경품의\')" style="width:100%;text-align:left;padding:14px 18px;font-size:0.88rem;">💼 ERP 등록 및 계약등록/변경품의</button>' +
        '<button class="btn btn-ghost" onclick="submitFinalizeWithAction(\'전자계약품의\')" style="width:100%;text-align:left;padding:14px 18px;font-size:0.88rem;">📄 전자계약품의</button>' +
      '</div>' +
      '<button onclick="document.getElementById(\'next-action-overlay\').style.display=\'none\'" style="padding:9px 24px;border-radius:10px;border:1.5px solid var(--border);background:var(--white);font-family:var(--font);font-size:0.85rem;font-weight:600;cursor:pointer;color:var(--text-muted);">취소</button>' +
      '</div>';
    document.body.appendChild(overlay);
  } else {
    overlay.style.display = 'flex';
  }

  // 매번 열 때마다 선택 상태 초기화
  __closeSelectedFiles = { clean: null, final: null };
  ['closeCleanFileName', 'closeFinalFileName'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '첨부된 파일 없음';
  });
  ['closeCleanFileInput', 'closeFinalFileInput'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ── 클린본/최종본 선택 상태 저장용 ──
var __closeSelectedFiles = { clean: null, final: null };

// ── 파일 선택 시 이름 표시 갱신 ──
function onCloseFileSelect(kind, inputEl) {
  var file = (inputEl.files && inputEl.files[0]) || null;
  __closeSelectedFiles[kind] = file;
  var labelEl = document.getElementById(kind === 'clean' ? 'closeCleanFileName' : 'closeFinalFileName');
  if (labelEl) labelEl.textContent = file ? file.name : '첨부된 파일 없음';
}

// ── 클린본/최종본 파일을 Drive에 업로드 (기존 재검토 첨부와 동일한 방식) ──
async function uploadCloseFileToDrive_(file) {
  var freshToken = await new Promise(function(resolve) {
    google.script.run.withSuccessHandler(resolve).withFailureHandler(function() { resolve(OAUTH_TOKEN); }).getFreshToken();
  });
  var activeToken = freshToken || OAUTH_TOKEN;

  var initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + activeToken,
      'Content-Type': 'application/json',
      'X-Upload-Content-Type': file.type || 'application/octet-stream',
      'X-Upload-Content-Length': file.size
    },
    body: JSON.stringify({ name: file.name })
  });
  if (!initRes.ok) throw new Error('Drive 세션 시작 실패: ' + initRes.status);

  var uploadUrl = initRes.headers.get('Location');
  var uploadRes = await fetch(uploadUrl, { method: 'PUT', body: file });
  if (!uploadRes.ok && uploadRes.status !== 200) throw new Error('업로드 실패: ' + uploadRes.status);

  return (await uploadRes.json()).id;
}

// ── 후속조치 선택 + 클린본/최종본 첨부 최종 제출 ──
async function submitFinalizeWithAction(nextAction) {
  var overlay = document.getElementById('next-action-overlay');
  var buttons = overlay.querySelectorAll('button');
  buttons.forEach(function(b) { b.disabled = true; });

  try {
    var cleanFileId = __closeSelectedFiles.clean ? await uploadCloseFileToDrive_(__closeSelectedFiles.clean) : null;
    var finalFileId = __closeSelectedFiles.final ? await uploadCloseFileToDrive_(__closeSelectedFiles.final) : null;

    await new Promise(function(resolve, reject) {
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.ok) resolve(result);
          else reject(new Error((result && result.error) || '알 수 없는 오류'));
        })
        .withFailureHandler(function(err) { reject(new Error(err.message || String(err))); })
        .finalizeReview(_selectedRev.id, nextAction, { cleanFileId: cleanFileId, finalFileId: finalFileId });
    });

    overlay.style.display = 'none';
    __closeSelectedFiles = { clean: null, final: null };

    var row = _revAll.find(function(r) { return r.id === _selectedRev.id; });
    if (row) { row.status = '검토완료'; row.nextAction = nextAction; row.confirmedAt = fmtDateTimeKo(new Date()); _selectedRev = row; }
    renderRevTable(_revFiltered.length ? _revFiltered : _revAll);
    renderRevDetailPanel();
  } catch (e) {
    showAlert(e.message || String(e), { title: '처리 실패', icon: '❌' });
  } finally {
    buttons.forEach(function(b) { b.disabled = false; });
  }
}

function handleRevReplyAttach(e) {
  var files = Array.from(e.target.files || []);
  e.target.value = '';
  files.forEach(function(f) {
    if (f.size > 20 * 1024 * 1024) {
      showAlert(f.name + '\n파일 크기가 20MB를 초과합니다.', { title: '파일 크기 초과', icon: '⚠️' });
      return;
    }
    _revReplyAttachFiles.push({ file: f, name: f.name, size: f.size, mimeType: f.type || 'application/octet-stream' });
  });
  renderRevReplyAttachList();
}

function removeRevReplyAttach(idx) {
  _revReplyAttachFiles.splice(idx, 1);
  renderRevReplyAttachList();
}

function renderRevReplyAttachList() {
  var el = document.getElementById('rev-reply-attach-list');
  if (!el) return;
  el.innerHTML = _revReplyAttachFiles.map(function(a, i) {
    return '<div class="attach-file-item"><span style="font-size:1rem;">📄</span><span class="afi-name">' + esc(a.name) + '</span><span class="afi-size">' + (a.size / 1024 / 1024).toFixed(2) + ' MB</span><button class="afi-remove" onclick="removeRevReplyAttach(' + i + ')">✕</button></div>';
  }).join('');
}

async function uploadRevReplyAttachments() {
  if (!_revReplyAttachFiles.length) return [];
  var freshToken = await new Promise(function(resolve) {
    google.script.run.withSuccessHandler(resolve).withFailureHandler(function() { resolve(OAUTH_TOKEN); }).getFreshToken();
  });
  var activeToken = freshToken || OAUTH_TOKEN;
  var results = [];
  for (var i = 0; i < _revReplyAttachFiles.length; i++) {
    var a = _revReplyAttachFiles[i];
    try {
      var initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + activeToken, 'Content-Type': 'application/json', 'X-Upload-Content-Type': a.mimeType, 'X-Upload-Content-Length': a.file.size },
        body: JSON.stringify({ name: a.name })
      });
      if (!initRes.ok) throw new Error('Drive 세션 시작 실패: ' + initRes.status);
      var uploadUrl = initRes.headers.get('Location');
      var uploadRes = await fetch(uploadUrl, { method: 'PUT', body: a.file });
      if (!uploadRes.ok && uploadRes.status !== 200) throw new Error('업로드 실패: ' + uploadRes.status);
      var fileId = (await uploadRes.json()).id;
      results.push({ fileId: fileId, name: a.name });
    } catch (e) {
      showAlert(a.name + ' 업로드 실패: ' + e.message, { title: '파일 업로드 실패', icon: '❌' });
    }
  }
  return results;
}

function insertQuickLabel(text) {
  var textarea = document.getElementById('rev-reply-textarea');
  if (!textarea) return;
  var start = textarea.selectionStart;
  var end = textarea.selectionEnd;
  var before = textarea.value.substring(0, start);
  var after = textarea.value.substring(end);
  textarea.value = before + (before && !before.endsWith('\n') ? '\n' : '') + text + after;
  var newPos = start + text.length + (before && !before.endsWith('\n') ? 1 : 0);
  textarea.setSelectionRange(newPos, newPos);
  textarea.focus();
}

function clearRevReply() {
  var textarea = document.getElementById('rev-reply-textarea');
  if (textarea) textarea.value = '';
  _revReplyAttachFiles = [];
  renderRevReplyAttachList();
}

function sendRevReply() {
  if (!_selectedRev) return;
  var textarea = document.getElementById('rev-reply-textarea');
  var opinion = textarea ? textarea.value.trim() : '';
  if (!opinion) { showAlert('검토 의견을 입력해주세요.', { title: '입력 필요', icon: '⚠️' }); return; }
  var toArr = [], ccArr = [];
  try { toArr = JSON.parse(_selectedRev.toList || '[]'); } catch(e) {}
  try { ccArr = JSON.parse(_selectedRev.ccList || '[]'); } catch(e) {}
  var recipientInfo = '수신: ' + _selectedRev.requesterEmail;
  if (toArr.length > 0) recipientInfo += ', ' + toArr.join(', ');
  if (ccArr.length > 0) recipientInfo += '\n참조(CC): ' + ccArr.join(', ');
  var attachInfo = _revReplyAttachFiles.length > 0 ? '\n첨부파일: ' + _revReplyAttachFiles.length + '건' : '';
  showConfirm(recipientInfo + attachInfo + '\n\n위 수신자에게 검토 의견을 이메일로 발송하시겠습니까?', {
    title: '검토 의견 발송', icon: '📧', okLabel: '발송',
    onOk: async function() {
      var btn = document.getElementById('rev-reply-send-btn');
      btn.disabled = true; btn.textContent = '발송 중...';
      try {
        var fileIdsJson = '[]';
        if (_revReplyAttachFiles.length > 0) {
          btn.textContent = '파일 업로드 중...';
          var uploaded = await uploadRevReplyAttachments();
          if (uploaded.length > 0) fileIdsJson = JSON.stringify(uploaded);
        }
        btn.textContent = '메일 발송 중...';
        await new Promise(function(resolve, reject) {
          google.script.run.withSuccessHandler(function(result) {
            if (result && result.ok) resolve(result); else reject(new Error((result && result.error) || '발송 실패'));
          }).withFailureHandler(function(err) { reject(new Error(err.message || String(err))); }).replyReview(_selectedRev.id, opinion, fileIdsJson);
        });
        showAlert('검토 의견이 요청자에게 이메일로 발송되었습니다.', { title: '발송 완료', icon: '✅' });
        textarea.value = ''; _revReplyAttachFiles = []; renderRevReplyAttachList();
        var row = _revAll.find(function(r){ return r.id === _selectedRev.id; });
        if (row) { row.status = '회신완료'; _selectedRev = row; }
        renderRevTable(_revFiltered.length ? _revFiltered : _revAll);
        loadRevReplyHistory(_selectedRev.id);
        renderRevDetailPanel();
      } catch (e) { showAlert(e.message, { title: '발송 실패', icon: '❌' }); }
      btn.disabled = false; btn.textContent = '📧 메일 발송 (회신완료) →';
    }
  });
}


function doChangeRevAssignee(){if(!_selectedRev) return;var sel=document.getElementById('rev-assignee-select');var email=sel?sel.value:'';if(!email){showAlert('진행자를 선택해주세요.',{title:'선택 필요',icon:'⚠️'});return;}google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var selectedOption=sel?sel.options[sel.selectedIndex]:null;var assigneeName=selectedOption?selectedOption.text:email.split('@')[0];var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.confirmedBy=assigneeName;_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll);renderRevDetailPanel();}else{showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'변경 실패',icon:'❌'});}}).withFailureHandler(function(err){showAlert(err.message||String(err),{title:'오류',icon:'❌'});}).changeReviewAssignee(_selectedRev.id,email);}

function doStartReview(){if(!_selectedRev) return;var btn=document.getElementById('rev-start-btn');if(btn){btn.disabled=true;btn.textContent='처리 중...';}google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.status='검토중';row.confirmedBy=result.assignee||'';_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll);renderRevDetailPanel();}else{showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'처리 실패',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='▶ 검토 시작';}}}).withFailureHandler(function(err){showAlert(err.message||String(err),{title:'오류',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='▶ 검토 시작';}}).startReview(_selectedRev.id);}

function doAgreeReview(){if(!_selectedRev) return;showConfirm('합의 완료 처리하시겠습니까?\n법무실에 합의 완료 사실이 전달됩니다.',{title:_selectedRev.contractName, icon:'✅', okLabel:'합의 완료',onOk:function(){var btn=document.getElementById('rev-agree-btn');if(btn){btn.disabled=true;btn.textContent='처리 중...';}google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.status='합의완료';_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll);renderRevDetailPanel();}else{showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'처리 실패',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='✅ 합의 완료';}}}).withFailureHandler(function(err){showAlert(err.message||String(err),{title:'오류',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='✅ 합의 완료';}}).agreeReview(_selectedRev.id);}});}

function doConfirmReview(){if(!_selectedRev) return;if(_selectedRev.status!=='합의완료'){showAlert('합의완료 상태에서만 검토 확인이 가능합니다.',{title:'처리 불가',icon:'⚠️'});return;}showConfirm('이 검토 요청을 검토완료 처리하시겠습니까?',{title:_selectedRev.contractName, icon:'✅', okLabel:'검토완료 처리',onOk:function(){var btn=document.getElementById('rev-confirm-btn');btn.disabled=true; btn.textContent='처리 중...';google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.status='검토완료';row.confirmedAt=fmtDateTimeKo(new Date());row.confirmedBy=row.confirmedBy||USER_EMAIL;_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll); renderRevDetailPanel();} else { showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'처리 실패',icon:'❌'}); btn.disabled=false; btn.textContent='✅ 검토 확인 완료'; }}).withFailureHandler(function(err){ showAlert(err.message||String(err),{title:'오류',icon:'❌'}); btn.disabled=false; btn.textContent='✅ 검토 확인 완료'; }).confirmReview(_selectedRev.id);}});}

function populateRevAssigneeSelect(){
  loadLegalMembers(function(members){
    var sel = document.getElementById('rev-assignee-select');
    if (!sel) return;
    var currentName = _selectedRev ? (_selectedRev.confirmedBy || '') : '';
    sel.innerHTML = '<option value="">진행자 선택...</option>' +
      members.map(function(m) {
        var isSelected = (currentName && (m.name === currentName || m.email === currentName));
        return '<option value="' + esc(m.email) + '"' + (isSelected ? ' selected' : '') + '>' + esc(m.name) + '</option>';
      }).join('');
  });
}

// ════════════════════════════════════════════════════════════
//  내 문의 현황
// ════════════════════════════════════════════════════════════
var _myInqAll = [], _myInqFiltered = [], _selectedMyInq = null;

function loadMyInquiries() {
  _selectedMyInq = null;
  document.getElementById('myinq-detail-panel').style.display = 'none';
  document.getElementById('myinq-list-count').textContent = '로드 중...';
  document.getElementById('myinq-tbody').innerHTML = '<tr><td colspan="5"><div class="dash-empty">⏳ 로드 중...</div></td></tr>';

  google.script.run
    .withSuccessHandler(function(rows) {
      _myInqAll = rows || [];
      _myInqFiltered = _myInqAll;
      renderMyInqTable(_myInqAll);
    })
    .withFailureHandler(function(err) {
      document.getElementById('myinq-tbody').innerHTML = '<tr><td colspan="5"><div class="list-empty"><div class="empty-icon">⚠️</div><p>로드 실패: ' + esc(err.message || String(err)) + '</p></div></td></tr>';
      document.getElementById('myinq-list-count').textContent = '—';
    })
    .getMyInquiries(USER_EMAIL, USER_NAME);
}

function filterMyInqTable() {
  var q = document.getElementById('myinq-search').value.trim().toLowerCase();
  _myInqFiltered = q ? _myInqAll.filter(function(r) {
    return r.category.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
  }) : _myInqAll;
  renderMyInqTable(_myInqFiltered);
}

function renderMyInqTable(rows) {
  var tbody = document.getElementById('myinq-tbody');
  var pendingCount = rows.filter(function(r) { return r.status !== '답변완료' && r.status !== '진행중'; }).length;
  var progressCount = rows.filter(function(r) { return r.status === '진행중'; }).length;
  var doneCount = rows.filter(function(r) { return r.status === '답변완료'; }).length;

  var countText = '전체 ' + rows.length + '건';
  if (pendingCount > 0) countText += ' · 미답변 ' + pendingCount + '건';
  if (progressCount > 0) countText += ' · 진행중 ' + progressCount + '건';
  if (doneCount > 0) countText += ' · 답변완료 ' + doneCount + '건';
  document.getElementById('myinq-list-count').textContent = countText;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="list-empty"><div class="empty-icon">📭</div><p>접수된 문의가 없습니다.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(function(r) {
    var isDone = r.status === '답변완료';
    var isProgress = r.status === '진행중';
    var isSelected = _selectedMyInq && _selectedMyInq.id === r.id;
    var badgeClass = isDone ? 'inq-status-done' : isProgress ? 'inq-status-progress' : 'inq-status-pending';
    var badgeText = isDone ? '답변완료' : isProgress ? '진행중' : '미답변';

    return '<tr data-id="' + esc(r.id) + '" onclick="selectMyInq(\'' + esc(r.id) + '\')" class="' + (isSelected ? 'selected' : '') + '">' +
      '<td class="col-radio"><input type="radio" class="row-radio" name="myinq-row" ' + (isSelected ? 'checked' : '') + ' onclick="event.stopPropagation();selectMyInq(\'' + esc(r.id) + '\')"></td>' +
      '<td style="text-align:center;white-space:nowrap;">' + esc(r.category) + '</td>' +
      '<td style="font-weight:500;">' + esc(r.title) + '</td>' +
      '<td class="hide-mobile" style="font-size:0.8rem;color:var(--text-muted);text-align:center;white-space:nowrap;">' + esc(fmtDateTimeKo(r.date)) + '</td>' +
      '<td style="text-align:center;white-space:nowrap;"><span class="inq-status-badge ' + badgeClass + '">' + badgeText + '</span></td>' +
      '</tr>';
  }).join('');
}

function selectMyInq(id) {
  var pool = _myInqFiltered.length ? _myInqFiltered : _myInqAll;
  _selectedMyInq = pool.find(function(r) { return r.id === id; }) || null;
  renderMyInqTable(pool);
  if (_selectedMyInq) renderMyInqDetailPanel();
}

function clearMyInqSel() {
  _selectedMyInq = null;
  renderMyInqTable(_myInqFiltered.length ? _myInqFiltered : _myInqAll);
  document.getElementById('myinq-detail-panel').style.display = 'none';
}

function renderMyInqDetailPanel() {
  var r = _selectedMyInq;
  var isDone = r.status === '답변완료';
  var isProgress = r.status === '진행중';

  document.getElementById('myinq-detail-title').textContent = '[' + r.category + '] ' + r.title;

  var badge = document.getElementById('myinq-detail-status-badge');
  badge.textContent = isDone ? '답변완료' : isProgress ? '진행중' : '미답변';
  badge.className = 'inq-status-badge ' + (isDone ? 'inq-status-done' : isProgress ? 'inq-status-progress' : 'inq-status-pending');

  document.getElementById('myinq-detail-meta').innerHTML = [
    { lbl: '접수일', val: fmtDateTimeKo(r.date) },
    { lbl: '유형', val: r.category },
    { lbl: '상태', val: isDone ? '답변완료' : isProgress ? '진행중' : '미답변' }
  ].map(function(f) {
    return '<div class="rev-meta-item"><div class="rev-meta-lbl">' + f.lbl + '</div><div class="rev-meta-val">' + esc(f.val) + '</div></div>';
  }).join('');

  document.getElementById('myinq-detail-content').textContent = r.content;

  var answerWrap = document.getElementById('myinq-answer-wrap');
  var waitingWrap = document.getElementById('myinq-waiting-wrap');

  if (isDone && r.answer) {
    answerWrap.style.display = 'block';
    waitingWrap.style.display = 'none';
    document.getElementById('myinq-answer-meta').textContent = '답변일: ' + fmtDateTimeKo(r.answerDate || '');
    document.getElementById('myinq-answer-text').textContent = stripAttachLines(r.answer);
    document.getElementById('myinq-answer-attach').innerHTML = renderAttachLinks(r.answer);
  } else {
    answerWrap.style.display = 'none';
    waitingWrap.style.display = 'block';
  }

  var panel = document.getElementById('myinq-detail-panel');
  panel.style.display = 'block';
  setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
}

window._inqLegalToList = [];
window._inqLegalCcList = [];

var currentCompany='IGAW', currentContract=null, selectedInqCategory='';
var _dashInterval = null;
function showPage(p) {
var heroEl  = document.querySelector('.hero');
var snapNav = document.getElementById('snap-nav');
var footer  = document.querySelector('footer');
if (heroEl)  heroEl.style.display  = (p === 'home') ? 'none' : '';
if (snapNav) snapNav.className      = (p === 'home') ? 'visible' : '';
if (footer)  footer.style.display  = (p === 'home') ? 'none' : '';
document.body.style.overflow        = (p === 'home') ? 'hidden' : '';
document.body.style.background      = (p === 'home') ? '#0d1117' : '';
clearInterval(_dashInterval);
_dashInterval = (p === 'home') ? setInterval(loadDashboard, 3 * 60 * 1000) : null;
document.querySelectorAll('.page').forEach(function(x){x.classList.remove('active');});
document.getElementById('page-'+p).classList.add('active');
var nb=document.querySelectorAll('.nav-btn');
nb.forEach(function(b){b.classList.remove('active');});
var idx={home:0,contract:1,submit:2,inquiry:3}[p];
if(idx!==undefined) nb[idx].classList.add('active');
window.scrollTo({top:0,behavior:'smooth'});
if(p==='contract'){ showContractTypeSelect(); }
if(p==='submit'){
document.getElementById('submit-flow').style.display='block';
document.getElementById('sel-panel').style.display='none';
document.getElementById('upload-zone').style.display='block';
document.getElementById('file-selected').style.display='none';
document.getElementById('upload-progress').style.display='none';
document.getElementById('list-search').value='';
selectedFile=null;
initSubmitData();
}
if(p==='inquiry'){
document.getElementById('inquiry-main').style.display='block';
selectedInqCategory='';
['inq-name','inq-dept','inq-title','inq-content'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
document.querySelectorAll('.category-card').forEach(function(c){c.classList.remove('selected');});
var btn=document.getElementById('inquiry-btn'); if(btn) btn.disabled=true;
// 로그인 사용자 정보 자동 채우기
if (USER_NAME) { var nameEl = document.getElementById('inq-name'); if (nameEl) { nameEl.value = USER_NAME; nameEl.readOnly = true; nameEl.style.background = '#f5f5f5'; } }
loadMemberList(function(members) {
  if (!USER_NAME) return;
  var me = members.find(function(m) { return m.name === USER_NAME || m.email === (USER_EMAIL||'').toLowerCase(); });
  if (me && me.dept) { var deptEl = document.getElementById('inq-dept'); if (deptEl) { deptEl.value = me.dept; deptEl.readOnly = true; deptEl.style.background = '#f5f5f5'; } }
  checkInquiryReady();
});
}
if(p==='home'){
var homeEl = document.getElementById('page-home');
if(homeEl) homeEl.scrollTop = 0;
loadDashboard();
}
if(p==='myinquiry')  loadMyInquiries();
if(p==='inqmgmt')    loadInqMgmt();
if(p==='reviewmgmt') loadReviewMgmt();
if(p==='myreview') loadMyReviews();
if(p==='reference') {
  var refBtn = document.getElementById('nav-reference');
  if (refBtn) refBtn.classList.add('active');
}  
}

function goBack(p){
if(p==='contract'){var formView=document.getElementById('contract-form-view');var listView=document.getElementById('contract-list-view');var nsView=document.getElementById('contract-nonstandard-view');var modView=document.getElementById('contract-modified-review-view');if(modView&&modView.style.display!=='none'){showContractList();return;}if(formView&&formView.style.display!=='none'){ showContractList(); return; }if(listView&&listView.style.display!=='none'){ showContractTypeSelect(); return; }if(nsView&&nsView.style.display!=='none'){ showContractTypeSelect(); return; }}
showPage('home');
}

function filterCompany(company, e) {
  currentCompany = company;
  document.querySelectorAll('.company-tab').forEach(function(t) { t.classList.remove('active'); });
  if (e && e.target) e.target.classList.add('active');
  var searchInput = document.getElementById('contract-search');
  if (searchInput) searchInput.value = '';
  renderContractGrid();
}
function renderContractGrid() {
  var allContracts = CONTRACTS.filter(function(c) { return c.company === currentCompany; });
  var autoWriteContracts = allContracts.filter(function(c) { return c.autoWrite; });
  var templateOnlyContracts = allContracts.filter(function(c) { return !c.autoWrite; });
  var html = '';
// ── 자동작성 지원 섹션 ──
  if (autoWriteContracts.length > 0) {
    html += '<div class="contract-section-label">✍️ 자동작성 지원</div>';
    html += '<div class="contract-grid-inner">';
    html += autoWriteContracts.map(function(c) {
      var btns = '<div class="card-btns" style="display:flex;justify-content:center;gap:8px;margin-top:14px;">';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();previewTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 미리보기</button>';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();downloadTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 다운로드</button>';
      btns += '</div>';
      btns += '<div style="margin-top:8px;"><button class="btn-sm" style="width:100%;padding:9px 0;border-color:var(--gold);color:var(--gold);" onclick="event.stopPropagation();requestModifiedReview(\'' + c.id + '\',\'' + esc(c.name) + '\',\'' + c.company + '\')">수정본 검토 요청</button></div>';
      return '<div class="contract-type-card" onclick="selectContractType(\'' + c.id + '\')">' +
        '<span class="tag ' + c.company.toLowerCase() + '">' + c.company + '</span>' +
        '<span class="auto-write-badge">✍️ 자동작성</span>' +
        '<h4>' + c.name + '</h4>' +
        '<p>' + c.desc + '</p>' +
        btns +
        '</div>';
    }).join('');
    html += '</div>';
  }

  // ── 양식만 제공 섹션 ──
  if (templateOnlyContracts.length > 0) {
    html += '<div class="contract-section-label" style="margin-top:32px;">📄 양식 제공 <span style="font-size:0.78rem;color:var(--text-muted);font-weight:400;">(미리보기 · 다운로드 · 수정본 검토)</span></div>';
    html += '<div class="contract-grid-inner">';
    html += templateOnlyContracts.map(function(c) {
      var btns = '<div class="card-btns" style="display:flex;justify-content:center;gap:8px;margin-top:14px;">';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();previewTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 미리보기</button>';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();downloadTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 다운로드</button>';
      btns += '</div>';
      btns += '<div style="margin-top:8px;"><button class="btn-sm" style="width:100%;padding:9px 0;border-color:var(--gold);color:var(--gold);" onclick="event.stopPropagation();requestModifiedReview(\'' + c.id + '\',\'' + esc(c.name) + '\',\'' + c.company + '\')">수정본 검토 요청</button></div>';
      return '<div class="contract-type-card" onclick="showNoAutoWriteAlert()">' +
        '<span class="tag ' + c.company.toLowerCase() + '">' + c.company + '</span>' +
        '<h4>' + c.name + '</h4>' +
        '<p>' + c.desc + '</p>' +
        btns +
        '</div>';
    }).join('');
    html += '</div>';
  }

  document.getElementById('contract-grid').innerHTML = html;
}
function filterContractGrid() {
  var q = document.getElementById('contract-search').value.trim().toLowerCase();
  if (!q) { renderContractGrid(); return; }
  var matched = CONTRACTS.filter(function(c) {
    return c.company === currentCompany && c.name.toLowerCase().includes(q);
  });
  var autoWriteContracts = matched.filter(function(c) { return c.autoWrite; });
  var templateOnlyContracts = matched.filter(function(c) { return !c.autoWrite; });
  var html = '';
  if (autoWriteContracts.length > 0) {
    html += '<div class="contract-section-label">✍️ 자동작성 지원</div>';
    html += '<div class="contract-grid-inner">';
    html += autoWriteContracts.map(function(c) {
      var btns = '<div class="card-btns" style="display:flex;justify-content:center;gap:8px;margin-top:14px;">';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();previewTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 미리보기</button>';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();downloadTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 다운로드</button>';
      btns += '</div>';
      btns += '<div style="margin-top:8px;"><button class="btn-sm" style="width:100%;padding:9px 0;border-color:var(--gold);color:var(--gold);" onclick="event.stopPropagation();requestModifiedReview(\'' + c.id + '\',\'' + esc(c.name) + '\',\'' + c.company + '\')">수정본 검토 요청</button></div>';
      return '<div class="contract-type-card" onclick="selectContractType(\'' + c.id + '\')">' +
        '<span class="tag ' + c.company.toLowerCase() + '">' + c.company + '</span>' +
        '<span class="auto-write-badge">✍️ 자동작성</span>' +
        '<h4>' + c.name + '</h4><p>' + c.desc + '</p>' + btns + '</div>';
    }).join('');
    html += '</div>';
  }
  if (templateOnlyContracts.length > 0) {
    html += '<div class="contract-section-label" style="margin-top:32px;">📄 양식 제공</div>';
    html += '<div class="contract-grid-inner">';
    html += templateOnlyContracts.map(function(c) {
      var btns = '<div class="card-btns" style="display:flex;justify-content:center;gap:8px;margin-top:14px;">';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();previewTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 미리보기</button>';
      btns += '<button class="btn-sm" onclick="event.stopPropagation();downloadTemplate(\'' + c.downloadId + '\',\'' + esc(c.name) + '\')">양식 다운로드</button>';
      btns += '</div>';
      btns += '<div style="margin-top:8px;"><button class="btn-sm" style="width:100%;padding:9px 0;border-color:var(--gold);color:var(--gold);" onclick="event.stopPropagation();requestModifiedReview(\'' + c.id + '\',\'' + esc(c.name) + '\',\'' + c.company + '\')">수정본 검토 요청</button></div>';
      return '<div class="contract-type-card" onclick="showNoAutoWriteAlert()">' +
        '<span class="tag ' + c.company.toLowerCase() + '">' + c.company + '</span>' +
        '<h4>' + c.name + '</h4><p>' + c.desc + '</p>' + btns + '</div>';
    }).join('');
    html += '</div>';
  }
  if (!matched.length) {
    html = '<div class="list-empty"><div class="empty-icon">🔍</div><p>검색 결과가 없습니다.</p></div>';
  }
  document.getElementById('contract-grid').innerHTML = html;
}
function showNoAutoWriteAlert() {
  showAlert('자동작성 기능을 지원하지 않습니다.\n양식 다운로드 후 수정본 검토 요청을 이용해주세요.', {
    title: '❎ 자동작성 미지원',
    icon: '❎'
  });
}
function previewTemplate(templateId, name) {
  document.getElementById('ref-modal-title').textContent = name + ' 미리보기';
  document.getElementById('ref-modal-tabs').style.display = 'none';
  document.getElementById('ref-modal-iframe').src = 'https://docs.google.com/document/d/' + templateId + '/preview';
  
  // notice 숨기기
  var notice = document.getElementById('preview-page-notice');
  if (notice) notice.style.display = 'none';
  
  document.getElementById('ref-modal-overlay').style.display = 'flex';
}

function downloadTemplate(downloadId, name) {
var url = 'https://docs.google.com/document/d/' + downloadId + '/export?format=docx';
var a = document.createElement('a');
a.href = url;
a.download = name + '.docx';
a.target = '_blank';
a.click();
}
function showContractList() {
  var formView = document.getElementById('contract-form-view');
  if (formView && formView.style.display === 'block' && currentContract && hasFormInput_()) {
    showConfirm(
      '작성 중인 내용이 저장되지 않고 삭제됩니다.\n정말 나가시겠습니까?',
      {
        title: '작성 중단',
        icon: '⚠️',
        type: 'danger',
        okLabel: '나가기',
        cancelLabel: '계속 작성',
        onOk: function() { doShowContractList_(); }
      }
    );
    return;
  }
  doShowContractList_();
}
function selectContractMode(mode){if(mode==='standard'){showContractList();} else {document.getElementById('contract-type-select-view').style.display='none';document.getElementById('contract-nonstandard-view').style.display='block';document.getElementById('nonstandard-form-wrap').style.display='block';resetNsForm();}}
var _nsAttachFiles=[];
window._nsToList=[]; window._nsCcList=[];
function handleNsFileSelect(e){var files=Array.from(e.target.files||[]); e.target.value='';files.forEach(function(f){if(f.size>20*1024*1024){ showAlert(f.name+'\n파일 크기가 20MB를 초과합니다.',{title:'파일 크기 초과',icon:'⚠️'}); return; }_nsAttachFiles.push({file:f,name:f.name,size:f.size,mimeType:f.type||'application/octet-stream'});});renderNsAttachList(); checkNsReady();}
function removeNsAttach(idx){ _nsAttachFiles.splice(idx,1); renderNsAttachList(); checkNsReady(); }
function renderNsAttachList(){document.getElementById('ns-attach-list').innerHTML=_nsAttachFiles.map(function(a,i){return '<div class="attach-file-item"><span style="font-size:1rem;">📄</span><span class="afi-name">'+esc(a.name)+'</span><span class="afi-size">'+(a.size/1024/1024).toFixed(2)+' MB</span><button class="afi-remove" onclick="removeNsAttach('+i+')">✕</button></div>';}).join('');}
function checkNsReady(){var ok=document.getElementById('ns-contract-name')&&document.getElementById('ns-contract-name').value.trim()&&document.getElementById('ns-counter-party')&&document.getElementById('ns-counter-party').value.trim()&&document.getElementById('ns-contract-party')&&document.getElementById('ns-contract-party').value&&_nsAttachFiles.length>0;var btn=document.getElementById('ns-submit-btn'); if(btn) btn.disabled=!ok;}
function addNsRecipient(type){var inputId=type==='to'?'ns-to-input':'ns-cc-input';var tagsId=type==='to'?'ns-to-tags':'ns-cc-tags';var listKey=type==='to'?'_nsToList':'_nsCcList';var input=document.getElementById(inputId); if(!input) return;var email=input.value.trim().toLowerCase();if(!email||!email.includes('@')){ input.style.borderColor='var(--red)'; setTimeout(function(){input.style.borderColor='';},1200); showAlert('올바른 이메일 주소를 입력해주세요.',{title:'이메일 형식 오류',icon:'⚠️'}); return; }if(window[listKey].includes(email)){input.value='';return;}window[listKey].push(email); input.value='';renderNsRecipientTags(tagsId,listKey);document.getElementById(type==='to'?'ns-to-ac':'ns-cc-ac').style.display='none';}
function removeNsRecipient(type,email){var listKey=type==='to'?'_nsToList':'_nsCcList', tagsId=type==='to'?'ns-to-tags':'ns-cc-tags';window[listKey]=window[listKey].filter(function(e){return e!==email;}); renderNsRecipientTags(tagsId,listKey);}
function renderNsRecipientTags(tagsId,listKey){var container=document.getElementById(tagsId); if(!container) return;container.innerHTML=(window[listKey]||[]).map(function(email){return '<span class="recipient-tag">'+esc(email)+'<button onclick="removeNsRecipient(\''+(tagsId.includes('to')?'to':'cc')+'\',\''+esc(email)+'\')" title="제거">✕</button></span>';}).join('');}
function selectNsParty(value, btn) {document.getElementById('ns-contract-party').value = value;document.querySelectorAll('.form-body .company-tabs .company-tab').forEach(function(t){ t.classList.remove('active'); });btn.classList.add('active');checkNsReady();}
function resetNsForm(){_nsAttachFiles.length=0; renderNsAttachList();window._nsToList=[]; window._nsCcList=[];['ns-contract-name','ns-counter-party','ns-opinion','ns-to-input','ns-cc-input'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });var party=document.getElementById('ns-contract-party'); document.querySelectorAll('.form-body .company-tabs .company-tab').forEach(function(t){ t.classList.remove('active'); }); if(party) party.value='';['ns-to-tags','ns-cc-tags'].forEach(function(id){ var el=document.getElementById(id); if(el) el.innerHTML=''; });['ns-to-ac','ns-cc-ac'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });var btn=document.getElementById('ns-submit-btn'); if(btn) btn.disabled=true;}
function resetNonStandard(){document.getElementById('nonstandard-form-wrap').style.display='block';resetNsForm();}
async function submitNonStandard(){var contractName=document.getElementById('ns-contract-name')?document.getElementById('ns-contract-name').value.trim():'';var counterParty=document.getElementById('ns-counter-party')?document.getElementById('ns-counter-party').value.trim():'';var contractParty=document.getElementById('ns-contract-party')?document.getElementById('ns-contract-party').value:'';var opinion=document.getElementById('ns-opinion')?document.getElementById('ns-opinion').value.trim():'';if(!contractName||!counterParty||!contractParty||!_nsAttachFiles.length){showAlert('필수 항목을 모두 입력하고 파일을 첨부해주세요.',{title:'입력 필요',icon:'⚠️'}); return;}var btn=document.getElementById('ns-submit-btn');btn.disabled=true; btn.textContent='파일 업로드 중...';try{var freshToken=await new Promise(function(resolve){ google.script.run.withSuccessHandler(resolve).withFailureHandler(function(){resolve(OAUTH_TOKEN);}).getFreshToken(); });var activeToken=freshToken||OAUTH_TOKEN;var uploadedFiles=[];for(var i=0;i<_nsAttachFiles.length;i++){var a=_nsAttachFiles[i];btn.textContent='파일 업로드 중... ('+(i+1)+'/'+_nsAttachFiles.length+')';var initRes=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',{method:'POST',headers:{'Authorization':'Bearer '+activeToken,'Content-Type':'application/json','X-Upload-Content-Type':a.mimeType,'X-Upload-Content-Length':a.file.size},body:JSON.stringify({name:a.name})});if(!initRes.ok) throw new Error('Drive 세션 시작 실패: '+initRes.status);var uploadUrl=initRes.headers.get('Location');var uploadRes=await fetch(uploadUrl,{method:'PUT',body:a.file});if(!uploadRes.ok&&uploadRes.status!==200) throw new Error('업로드 실패: '+uploadRes.status);var fileId=(await uploadRes.json()).id;uploadedFiles.push({name:a.name,fileId:fileId,url:'https://drive.google.com/file/d/'+fileId+'/view'});}btn.textContent='검토 요청 중...';await new Promise(function(resolve,reject){google.script.run.withSuccessHandler(function(result){ if(result&&result.ok) resolve(result); else reject(new Error((result&&result.error)||'검토 요청 실패')); }).withFailureHandler(function(err){reject(new Error(err.message||'검토 요청 실패'));}).submitNonStandardReview({contractName:contractName, counterParty:counterParty, contractParty:contractParty, opinion:opinion,files:JSON.stringify(uploadedFiles),toList:JSON.stringify(window._nsToList||[]),ccList:JSON.stringify(window._nsCcList||[]),userEmail:USER_EMAIL||'',userName:USER_NAME||''});});showAlert('법무실에 검토 요청이 전달되었습니다.', {title: '검토 요청이 완료되었습니다!',icon: '\u2705',onClose: function() { resetNonStandard(); }});btn.disabled=false; btn.textContent='검토 요청 →';}catch(e){showAlert(e.message,{title:'오류가 발생했습니다',icon:'❌'});btn.disabled=false; btn.textContent='검토 요청 →';}}
function selectContractType(id) {
  currentContract = CONTRACTS.find(function(c) { return c.id === id; });
  if (!currentContract) return;
  if (!currentContract.autoWrite) { showNoAutoWriteAlert(); return; }

  showAlert(
    '자동작성 중 뒤로가기·취소·새로고침 시\n입력한 내용이 저장되지 않고 삭제됩니다.\n\n작성 전 필요한 정보를 미리 준비해 주세요.',
    { title: '📝 자동작성 안내', icon: '📝', onClose: function() {
      renderForm();
      document.getElementById('contract-list-view').style.display = 'none';
      document.getElementById('contract-form-view').style.display = 'block';
      document.getElementById('contract-modified-review-view').style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }}
  );
}
function renderForm(){
var c=currentContract; var html='', grid=[];
var flush=function(){ if(grid.length){html+='<div class="form-grid">'+grid.join('')+'</div>';grid=[];} };
c.fields.forEach(function(f){ if(f.section){flush();html+='<div class="field-section-title">'+f.section+'</div>';return;} grid.push(renderField(f)); });flush();
document.getElementById('contract-form-container').innerHTML='<div class="form-container"><div class="form-header"><div class="form-header-left"><div class="form-tag">'+c.company+' \u00b7 Standard Contract</div><h3>'+c.name+'</h3></div><div class="form-header-right">필수 항목<br><strong>'+c.fields.filter(function(f){return f.required;}).length+'개</strong></div></div><div class="form-body">'+html+'</div><div class="review-section"><label class="review-toggle"><input type="checkbox" id="review-check" onchange="toggleReviewFields()"><div><div class="review-toggle-label">\u2696\ufe0f 법무실 검토 요청</div><div class="review-toggle-sub">체크 시 생성된 계약서와 검토 의견이 법무실 이메일로 전송되며, 법무실은 하단 수신자 또는 참조자로 지정하지 않아도 됩니다.</div></div></label><div class="review-fields" id="review-fields" style="display:flex;"><div class="form-group"><label>검토 요청 의견</label><textarea id="review-opinion" placeholder="검토가 필요한 부분이나 특이사항을 작성해 주세요." oninput="onFieldChange()"></textarea></div><div class="form-group"><label>추가 수신자 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="recipient-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete(\'recipient-input\',\'to-ac\')" onkeydown="handleAcKeydown(event,\'recipient-input\',\'to-ac\',\'to\')"><div class="autocomplete-list" id="to-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addRecipient(\'to\')">+ 수신</button></div><div class="recipient-tags" id="to-tags"></div></div><div class="form-group"><label>참조(CC) 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="cc-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete(\'cc-input\',\'cc-ac\')" onkeydown="handleAcKeydown(event,\'cc-input\',\'cc-ac\',\'cc\')"><div class="autocomplete-list" id="cc-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addRecipient(\'cc\')">+ 참조</button></div><div class="recipient-tags" id="cc-tags"></div></div></div></div><div class="form-footer"><div class="form-footer-note"><strong>*</strong> 필수 항목</div><div class="btn-row"><button class="btn btn-ghost" onclick="showContractList()">취소</button><button class="btn btn-ghost" id="preview-btn" onclick="previewCurrentContract()" disabled>미리보기</button><button class="btn btn-gold" id="gen-btn" onclick="generateContract()" disabled>작성 완료</button></div></div></div>';
window._reviewToList=[]; window._reviewCcList=[];
// ★ 추가: 모바일인덱스 GAME Group 선택을 금액/비고 입력창 위로 이동
if (c.id === 'igaw_subscription') {
  var gameGroupEl     = document.querySelector('.form-group[data-linked-to="모바일인덱스 GAME"]');
  var gameLinkedInline = document.querySelector('.linked-fields-inline[data-linked-to="모바일인덱스 GAME"]');
  if (gameGroupEl && gameLinkedInline && gameLinkedInline.parentNode) {
    gameLinkedInline.parentNode.insertBefore(gameGroupEl, gameLinkedInline);
  }
}  
// ── 기본값 세팅 (innerHTML 이후) ──
  // textarea 기본값 높이 자동 조절
document.querySelectorAll('#contract-form-container textarea').forEach(function(ta) {
  if (ta.value) {
    ta.style.height = 'auto';
    ta.style.height = Math.max(96, ta.scrollHeight) + 'px';
  }
});
  if (c.id === 'adp_reward_media_partnership') {
    var defaults = {
      'renewal_terms':      '계약 만료 전 30일 이내에 서면으로 계약갱신 거절의 의사표시 또는 계약 내용의 변경 요구를 하지 아니하면 계약기간 만료일 익일부터 동일한 조건으로 자동적으로 1년씩 갱신된다.',
      'invoice_date_terms': '광고집행월(M월) 말일',
      'payment_date_terms': '세금계산서 발행일 기준 익월(M+1) 말일 (주말, 공휴일인 경우 익영업일 이내)',
      'revenue_company':    '30',
      'revenue_client':     '70'
    };
    for (var key in defaults) {
      var el = document.getElementById(key);
      if (el && !el.value) el.value = defaults[key];
    }
  }
}
function renderField(f){
  var sc=f.span===2?' span-2':'',
      req=f.required?'<span class="req">*</span>':'',
      hint=f.hint?'<div class="hint">'+f.hint+'</div>':'';
  var linkedAttr = f.linkedTo ? ' data-linked-to="'+f.linkedTo+'" style="display:none;"' : '';
  var inp='';

    if(f.type==='textarea')
    inp='<textarea id="f_'+f.name+'" placeholder="'+(f.placeholder||f.label)+'" oninput="onFieldChange()">'+(f.defaultValue||'')+'</textarea>'
      +'<div class="ai-btn-row"><button type="button" class="btn-ai" onclick="aiAssist(\''+f.name+'\')">✨ AI 추천</button></div>';

    else if(f.type==='checkbox') {
  if (f.options) {
    inp='<div class="checkbox-list">'+f.options.map(function(o,idx){var num=idx+1;return '<label class="checkbox-item"><input type="checkbox" value="'+o+'" data-field="'+f.name+'" onchange="this.closest(\'.checkbox-item\').classList.toggle(\'checked\',this.checked);onFieldChange();toggleLinkedFields()"><span>'+o+'</span></label>'+'<div class="linked-fields-inline" data-linked-to="'+o+'" style="display:none;padding:8px 0 12px 28px;"><div class="form-grid" style="gap:12px;"><div class="form-group"><label>금액(원, 부가세 별도)</label><input type="text" id="f_fee_'+num+'" placeholder="금액" oninput="formatNumberInput(this);onFieldChange()"></div><div class="form-group"><label>비고</label><input type="text" id="f_etc_'+num+'" placeholder="비고" oninput="onFieldChange()"></div></div></div>';}).join('')+'</div>';
 } else {
  inp='<label class="checkbox-item"><input type="checkbox" data-field="'+f.name+'" value="true" onchange="this.closest(\'.checkbox-item\').classList.toggle(\'checked\',this.checked);onFieldChange();toggleLinkedFields()"><span>'+f.label+'</span></label>';
}
}

  else if(f.type==='radio')
    inp='<div class="radio-row">'+f.options.map(function(o){
      return '<label class="radio-item"><input type="radio" name="f_'+f.name+'" value="'+o+'" onchange="onFieldChange();toggleLinkedFields();if(this.name===\'f_payment_method\')updatePaymentDetail()"><span>'+o+'</span></label>';
    }).join('')+'</div>';

  else {
    var isEndDate=f.name.endsWith('_end')||f.name==='end_date',
        isStartDate=f.name.endsWith('_start')||f.name==='start_date';
    var extraAttr='';
    if(isStartDate){
      var endFieldName=f.name.replace('_start','_end').replace('start_date','end_date');
      extraAttr=' onchange="onFieldChange();updateEndDateMin(\'f_'+f.name+'\',\'f_'+endFieldName+'\')"';
    }
    if(isEndDate) extraAttr=' oninput="onFieldChange()"';

    var currencyAttr = (f.format==='currency') ? ' oninput="formatNumberInput(this);onFieldChange()"' : '';
inp='<input type="'+f.type+'" id="f_'+f.name+'" placeholder="'+f.label+'"'+(f.defaultValue?' value="'+f.defaultValue+'"':'')+(f.format==='currency' ? currencyAttr : (isEndDate||isStartDate?'':' oninput="onFieldChange()"'))+extraAttr+'>';
  }

  return '<div class="form-group'+sc+'"'+linkedAttr+'><label>'+f.label+' '+req+'</label>'+inp+hint+'</div>';
}
function toggleReviewFields(){ var checked=document.getElementById('review-check');checked=checked?checked.checked:false; var fields=document.getElementById('review-fields'); if(fields) fields.style.display=checked?'flex':'none'; }
function addRecipient(type){var inputId=type==='to'?'recipient-input':'cc-input', tagsId=type==='to'?'to-tags':'cc-tags', listKey=type==='to'?'_reviewToList':'_reviewCcList';var input=document.getElementById(inputId); if(!input) return;var email=input.value.trim().toLowerCase();if(!email||!email.includes('@')){ input.style.borderColor='var(--red)'; setTimeout(function(){input.style.borderColor='';},1200); showAlert('올바른 이메일 주소를 입력해주세요.',{title:'이메일 형식 오류',icon:'⚠️'}); return; }if(window[listKey].includes(email)){input.value='';return;}window[listKey].push(email); input.value=''; renderRecipientTags(tagsId,listKey);}
function removeRecipient(type,email){ var listKey=type==='to'?'_reviewToList':'_reviewCcList', tagsId=type==='to'?'to-tags':'cc-tags'; window[listKey]=window[listKey].filter(function(e){return e!==email;}); renderRecipientTags(tagsId,listKey); }
function renderRecipientTags(tagsId,listKey){ var container=document.getElementById(tagsId); if(!container) return; container.innerHTML=(window[listKey]||[]).map(function(email){return '<span class="recipient-tag">'+esc(email)+'<button onclick="removeRecipient(\''+(tagsId.includes('to')?'to':'cc')+'\',\''+esc(email)+'\')" title="제거">✕</button></span>';}).join(''); }
function updateEndDateMin(startId,endId){ var startEl=document.getElementById(startId),endEl=document.getElementById(endId); if(!startEl||!endEl) return; var startVal=startEl.value; if(!startVal) return; endEl.min=startVal; if(endEl.value&&endEl.value<startVal){endEl.value='';onFieldChange();} }
function onFieldChange(){ var v=validateCurrentForm(); var b=document.getElementById('gen-btn'); if(b) b.disabled=!v; var p=document.getElementById('preview-btn'); if(p) p.disabled=!v; }
function updatePaymentDetail() {
  var method = document.querySelector('input[name="f_payment_method"]:checked');
  if (!method) return;
  var textarea = document.getElementById('f_payment_detail');
  if (!textarea) return;
  var templates = {
    '일시납': '세금계산서 발행일 기준 익월 말일 이내 (세금계산서 발행일: 이용시작월 말일자 발행)',
    '분기납': '세금계산서 발행일 기준 익월 말일 이내 (세금계산서 발행일: 분기 마지막월 말일자 발행)',
    '월분납': '세금계산서 발행일 기준 익월 말일 이내 (세금계산서 발행일: 매월 말일자 발행)',
    '기타': '아래 기타사항에 명시한 바에 따름'
  };
  textarea.value = templates[method.value] || '';
}
function toggleLinkedFields() {
  // 1. 체크박스 연동 — 멀티 체크박스 (모바일인덱스 서비스 등)
  var checkedValues = Array.from(document.querySelectorAll('input[data-field="services"]:checked')).map(function(el){ return el.value; });
  var linkedInline = document.querySelectorAll('.linked-fields-inline');
  linkedInline.forEach(function(el) {
    var linkedTo = el.getAttribute('data-linked-to');
    el.style.display = checkedValues.indexOf(linkedTo) >= 0 ? 'block' : 'none';
  });
  // ★ 추가: 멀티 체크박스로 연동되는 일반 form-group(예: game_group)도 함께 토글
  document.querySelectorAll('.form-group[data-linked-to]').forEach(function(el) {
    var linkedTo = el.getAttribute('data-linked-to');
    if (checkedValues.indexOf(linkedTo) >= 0) el.style.display = '';
  });

  // 2. 단독 체크박스 연동 (use_lite, use_standard, use_pro, use_mau, use_support, use_discount 등)
  var soloCheckboxes = document.querySelectorAll('input[type="checkbox"][data-field][value="true"]');
  soloCheckboxes.forEach(function(cb) {
    var fieldName = cb.getAttribute('data-field');
    var isChecked = cb.checked;
    var label = cb.closest('.checkbox-item') ? cb.closest('.checkbox-item').querySelector('span').textContent : '';
    if (label) {
      document.querySelectorAll('.form-group[data-linked-to="' + label + '"]').forEach(function(el) {
        el.style.display = isChecked ? '' : 'none';
      });
    }
  });

  // 3. 라디오 연동 (선불/후불, 보증보험 제출/미제출 등)
  var allLinkedGroups = document.querySelectorAll('.form-group[data-linked-to]');
  allLinkedGroups.forEach(function(el) {
    var linkedTo = el.getAttribute('data-linked-to');
    var handledBySolo = false;
    soloCheckboxes.forEach(function(cb) {
      var lbl = cb.closest('.checkbox-item') ? cb.closest('.checkbox-item').querySelector('span').textContent : '';
      if (lbl === linkedTo) handledBySolo = true;
    });
    // ★ 수정: services 멀티체크박스로 이미 처리된 것도 건너뛰기
    var handledByMulti = checkedValues.indexOf(linkedTo) >= 0;
    if (!handledBySolo && !handledByMulti) el.style.display = 'none';
  });
  var radios = document.querySelectorAll('input[type="radio"]:checked');
  radios.forEach(function(r) {
    var val = r.value;
    document.querySelectorAll('.form-group[data-linked-to="' + val + '"]').forEach(function(el) {
      el.style.display = '';
    });
  });

  document.querySelectorAll('#contract-form-container textarea').forEach(function(ta) {
    if (ta.value && ta.offsetParent !== null) {
      ta.style.height = 'auto';
      ta.style.height = Math.max(96, ta.scrollHeight) + 'px';
    }
  });
}
function validateCurrentForm(){if(!currentContract) return false;for(var i=0;i<currentContract.fields.length;i++){var f=currentContract.fields[i];if(!f.required||f.section) continue;if(f.type==='checkbox'){if(!document.querySelectorAll('input[data-field="'+f.name+'"]:checked').length) return false;}else if(f.type==='radio'){if(!document.querySelector('input[name="f_'+f.name+'"]:checked')) return false;}else{var el=document.getElementById('f_'+f.name);if(!el||!el.value.trim()) return false;}}return true;}
function collectFormData(){
  var d={};
  currentContract.fields.forEach(function(f){
    if(f.section) return;
    if(f.type==='checkbox'){
      d[f.name]=Array.from(document.querySelectorAll('input[data-field="'+f.name+'"]:checked')).map(function(c){return c.value;});
      if (f.options) {
        f.options.forEach(function(o, idx){
          var num = idx + 1;
          var feeEl = document.getElementById('f_fee_'+num);
          var etcEl = document.getElementById('f_etc_'+num);
          if (feeEl) d['fee_'+num] = feeEl.value;
          if (etcEl) d['etc_'+num] = etcEl.value;
        });
      }
    }
    else if(f.type==='radio'){
      var el=document.querySelector('input[name="f_'+f.name+'"]:checked');
      d[f.name]=el?el.value:'';
    }
    else{
      var el=document.getElementById('f_'+f.name);
      d[f.name]=el?el.value:'';
    }
  });
  return d;
}
async function generateContract(){if(!validateCurrentForm()) return;var container=document.getElementById('contract-form-container');var raw=collectFormData();var toKo=function(d){if(!d) return '';var p=d.split('-');return p.length===3?p[0]+'\ub144 '+p[1]+'\uc6d4 '+p[2]+'\uc77c':d;};var fmtN=function(n){var s=String(n).replace(/[^0-9]/g,'');return s?Number(s).toLocaleString('ko-KR'):'';};var dateF=['contract_date','service_start','service_end','ad_start','ad_end','media_start','media_end','reward_start','reward_end','original_contract_date','SIGN_DATE','sign_date','agreement_start','agreement_end','start_date','end_date'];
var numF=['service_cost','total_amount','monthly_fee','contract_amount','ad_budget','cpa_rate'];var payload={contractType:currentContract.id,contractName:currentContract.name};Object.keys(raw).forEach(function(k){if(dateF.includes(k)) payload[k]=toKo(raw[k]);else if(numF.includes(k)) payload[k]=fmtN(raw[k]);else payload[k]=Array.isArray(raw[k])?raw[k].join(', '):raw[k];});payload.remarks=(payload.remarks&&payload.remarks.trim())||'\uc5c6\uc74c';payload.invoice_date=payload.invoice_date||'\uc6a9\uc5ed \uc644\ub8cc \uc6d4\uc758 \ub9d0\uc77c';payload.payment_date=payload.payment_date||'\uc138\uae08\uacc4\uc0b0\uc11c \ubc1c\ud589\uc77c \uae30\uc900 \uc775\uc6d4 \ub9d0\uc77c \uc774\ub0b4';payload.userId=SLACK_USER_ID; payload.userEmail=USER_EMAIL||'';var reviewCheck=document.getElementById('review-check');payload.isReviewRequested=reviewCheck?reviewCheck.checked===true:false;payload.reviewOpinion=(document.getElementById('review-opinion')?document.getElementById('review-opinion').value.trim():'')||'';payload.reviewToList=JSON.stringify(window._reviewToList||[]);payload.reviewCcList=JSON.stringify(window._reviewCcList||[]);saveFormToSession_();container.innerHTML='<div class="state-panel"><div class="spinner"></div><h3>계약서를 생성하고 있습니다...</h3><p>잠시만 기다려주세요.</p></div>';try{var genResult=await new Promise(function(resolve,reject){google.script.run.withSuccessHandler(resolve).withFailureHandler(function(err){reject(new Error(err.message||'계약서 생성 실패'));}).handleGenerateContract(JSON.stringify(payload));});window._generatedFileId=genResult&&genResult.fileId?genResult.fileId:'';window._generatedFileName=genResult&&genResult.fileName?genResult.fileName:payload.contractName+'.docx';container.innerHTML='<div class="state-panel"><div class="success-panel"><div class="success-badge">\u2705</div><h3>계약서 생성 완료!</h3><p style="margin:12px 0 20px;">아래 버튼으로 파일을 다운로드하거나 Slack/이메일로 전송하세요.</p><div style="display:flex;flex-direction:column;gap:10px;align-items:center;max-width:360px;margin:0 auto 24px;"><button class="btn btn-gold" onclick="downloadGeneratedContract()" style="width:100%;">\u2b07 계약서 다운로드 (.docx)</button><button class="btn btn-ghost" onclick="sendGeneratedContract(\'slack\')" style="width:100%;">💬 Slack DM으로 전송</button><button class="btn btn-ghost" onclick="sendGeneratedContract(\'email\')" style="width:100%;">📧 이메일로 전송</button></div><div style="display:flex;gap:12px;justify-content:center;"><button class="btn btn-ghost" onclick="showPage(\'home\')">홈으로</button><button class="btn btn-ghost" onclick="restoreLastForm()">✏️ 수정하기</button><button class="btn btn-dark" onclick="showContractList()">다른 계약서 작성</button></div></div></div>';}catch(e){ container.innerHTML='<div class="state-panel"><h3>\u26a0\ufe0f 오류</h3><p>'+e.message+'</p><button class="btn btn-ghost" onclick="showContractList()">돌아가기</button></div>'; }}
function goToInquiryWithCategory(category) {
  showPage('inquiry');
  setTimeout(function() {
    var cards = document.querySelectorAll('.category-card');
    cards.forEach(function(c) {
      c.classList.remove('selected');
      if (c.querySelector('.cat-text').textContent === category) {
        c.classList.add('selected');
      }
    });
    selectedInqCategory = category;
    applyContentTemplate(category);
    checkInquiryReady();
  }, 100);
}

function applyContentTemplate(category) {
  var el = document.getElementById('inq-content');
  if (!el) return;
  var templates = {
    '체결된 계약서 확인 요청': '- ERP 계약관리번호 : \n- 계약 상대방 : \n- 계약명 : ',
    '표준계약서 변경 요청': '- 변경하고자 하는 표준계약서 : \n- 변경 요청 사항 : '
  };
  el.value = templates[category] || '';
}
function selectCategory(el, cat) {
  document.querySelectorAll('.category-card').forEach(function(c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  selectedInqCategory = cat;
  applyContentTemplate(cat);
  var legalRecipients = document.getElementById('inq-legal-recipients');
  if (legalRecipients) {
    legalRecipients.style.display = (cat === '법률 자문') ? 'block' : 'none';
    if (cat !== '법률 자문') {
      window._inqLegalToList = [];
      window._inqLegalCcList = [];
      var toTags = document.getElementById('inq-legal-to-tags'); if (toTags) toTags.innerHTML = '';
      var ccTags = document.getElementById('inq-legal-cc-tags'); if (ccTags) ccTags.innerHTML = '';
    }
  }
  checkInquiryReady();
}
function addInqLegalRecipient(type) {
  var inputId = type === 'to' ? 'inq-legal-to-input' : 'inq-legal-cc-input';
  var tagsId = type === 'to' ? 'inq-legal-to-tags' : 'inq-legal-cc-tags';
  var listKey = type === 'to' ? '_inqLegalToList' : '_inqLegalCcList';
  var input = document.getElementById(inputId); if (!input) return;
  var email = input.value.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    input.style.borderColor = 'var(--red)';
    setTimeout(function() { input.style.borderColor = ''; }, 1200);
    showAlert('올바른 이메일 주소를 입력해주세요.', { title: '이메일 형식 오류', icon: '⚠️' });
    return;
  }
  if (window[listKey].includes(email)) { input.value = ''; return; }
  window[listKey].push(email); input.value = '';
  renderInqLegalRecipientTags(tagsId, listKey);
  var acId = type === 'to' ? 'inq-legal-to-ac' : 'inq-legal-cc-ac';
  document.getElementById(acId).style.display = 'none';
}

function removeInqLegalRecipient(type, email) {
  var listKey = type === 'to' ? '_inqLegalToList' : '_inqLegalCcList';
  var tagsId = type === 'to' ? 'inq-legal-to-tags' : 'inq-legal-cc-tags';
  window[listKey] = window[listKey].filter(function(e) { return e !== email; });
  renderInqLegalRecipientTags(tagsId, listKey);
}

function renderInqLegalRecipientTags(tagsId, listKey) {
  var container = document.getElementById(tagsId); if (!container) return;
  container.innerHTML = (window[listKey] || []).map(function(email) {
    return '<span class="recipient-tag">' + esc(email) +
      '<button onclick="removeInqLegalRecipient(\'' + (tagsId.includes('to') ? 'to' : 'cc') + '\',\'' + esc(email) + '\')" title="제거">✕</button></span>';
  }).join('');
}
function checkInquiryReady(){ var ok=document.getElementById('inq-name')&&document.getElementById('inq-name').value.trim()&&document.getElementById('inq-dept')&&document.getElementById('inq-dept').value.trim()&&selectedInqCategory&&document.getElementById('inq-title')&&document.getElementById('inq-title').value.trim()&&document.getElementById('inq-content')&&document.getElementById('inq-content').value.trim(); var b=document.getElementById('inquiry-btn'); if(b) b.disabled=!ok; }
async function submitInquiry() {
  var name = document.getElementById('inq-name') ? document.getElementById('inq-name').value.trim() : '';
  var dept = document.getElementById('inq-dept') ? document.getElementById('inq-dept').value.trim() : '';
  var title = document.getElementById('inq-title') ? document.getElementById('inq-title').value.trim() : '';
  var content = document.getElementById('inq-content') ? document.getElementById('inq-content').value.trim() : '';
  var category = selectedInqCategory || '';
  var userEmail = USER_EMAIL || '';
  var userSlackId = SLACK_USER_ID ? SLACK_USER_ID : '';

  // 법률 자문 수신자/참조자
  var toList = (category === '법률 자문') ? JSON.stringify(window._inqLegalToList || []) : '[]';
  var ccList = (category === '법률 자문') ? JSON.stringify(window._inqLegalCcList || []) : '[]';

  var m = document.getElementById('inquiry-main');
  var inqBtn = document.getElementById('inquiry-btn');
  if (inqBtn) { inqBtn.disabled = true; inqBtn.textContent = '전송 중...'; }

  try {
    var attachText = '';
    if (_attachFiles['inq-form'].length > 0) {
      var attachInfos = await uploadAttachmentsToDrive('inq-form');
      if (attachInfos.length > 0) attachText = buildAttachText(attachInfos);
      _attachFiles['inq-form'] = []; renderAttachList('inq-form');
    }
    var finalContent = content + (attachText ? '\n\n' + attachText : '');

    await new Promise(function(resolve, reject) {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(function(err) { reject(new Error(err.message || '문의 전송 실패')); })
        .handleSubmitInquiry(name, dept, category, title, finalContent, userEmail, userSlackId, toList, ccList);
    });

    showAlert('문의사항이 법무실로 전송되었습니다.\n확인 후 순차적으로 Slack 또는 메일로 답변드리겠습니다.', {
      title: '문의가 접수되었습니다!', icon: '\u2705',
      onClose: function() {
        if (inqBtn) { inqBtn.disabled = true; inqBtn.textContent = '문의 전송'; }
        showPage('inquiry');
      }
    });
  } catch (e) {
  if (inqBtn) { inqBtn.disabled = false; inqBtn.textContent = '문의 전송'; }
  showAlert(e.message, { title: '오류가 발생했습니다', icon: '❌' });  
  }
}
function downloadGeneratedContract() {
  var fileId   = window._generatedFileId   || '';
  var fileName = window._generatedFileName || '계약서.docx';

  if (!fileId) {
    showAlert('파일 정보가 없습니다. 다시 시도해주세요.', { title: '파일 없음', icon: '⚠️' });
    return;
  }

  var btn = document.querySelector('[onclick="downloadGeneratedContract()"]');
  if (btn) { btn.disabled = true; btn.textContent = '다운로드 중...'; }

  google.script.run
    .withSuccessHandler(function(result) {
      if (!result || !result.ok) {
        showAlert((result && result.error) || '다운로드 실패', { title: '오류', icon: '❌' });
        if (btn) { btn.disabled = false; btn.textContent = '⬇ 계약서 다운로드 (.docx)'; }
        return;
      }
      var byteChars = atob(result.base64);
      var byteArr   = new Uint8Array(byteChars.length);
      for (var i = 0; i < byteChars.length; i++) {
        byteArr[i] = byteChars.charCodeAt(i);
      }
      var blob = new Blob([byteArr], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      var url = URL.createObjectURL(blob);
      var a   = document.createElement('a');
      a.href     = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (btn) { btn.disabled = false; btn.textContent = '⬇ 계약서 다운로드 (.docx)'; }
    })
    .withFailureHandler(function(err) {
      showAlert(err.message || String(err), { title: '다운로드 오류', icon: '❌' });
      if (btn) { btn.disabled = false; btn.textContent = '⬇ 계약서 다운로드 (.docx)'; }
    })
    .getContractFileBase64(fileId);  // ← 추가
}  // ← 추가
async function sendGeneratedContract(method){var fileId=window._generatedFileId, fileName=window._generatedFileName||'계약서.docx';if(!fileId){ showAlert('파일 정보가 없습니다. 다시 시도해주세요.',{title:'파일 없음',icon:'⚠️'}); return; }var btn=event.target; btn.disabled=true; btn.textContent='전송 중...';var freshToken=await new Promise(function(resolve){ google.script.run.withSuccessHandler(resolve).withFailureHandler(function(){resolve(OAUTH_TOKEN);}).getFreshToken(); });var userId=SLACK_USER_ID?SLACK_USER_ID:'';google.script.run.withSuccessHandler(function(result){if(result&&result.ok){ btn.disabled=true; btn.textContent=method==='slack'?'\u2705 Slack 전송 완료':'\u2705 이메일 전송 완료'; }else{ btn.disabled=false; btn.textContent=method==='slack'?'💬 Slack DM으로 전송':'📧 이메일로 전송'; showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'전송 실패',icon:'❌'}); }}).withFailureHandler(function(err){ btn.disabled=false; btn.textContent=method==='slack'?'💬 Slack DM으로 전송':'📧 이메일로 전송'; showAlert(err.message||String(err),{title:'전송 오류',icon:'❌'}); }).sendContractFile(fileId,fileName,method,userId,USER_EMAIL);}

// ════════════════════════════════════════════════════════════
//  멤버/법무팀 목록
// ════════════════════════════════════════════════════════════
var _memberList=null;
function loadMemberList(cb){ if(_memberList!==null){if(cb) cb(_memberList);return;} google.script.run.withSuccessHandler(function(rows){_memberList=rows||[];if(cb) cb(_memberList);}).withFailureHandler(function(){_memberList=[];if(cb) cb([]);}).getMemberList(); }
var _legalMembers=null;
function loadLegalMembers(cb){if(_legalMembers!==null){if(cb) cb(_legalMembers);return;}google.script.run.withSuccessHandler(function(rows){ _legalMembers=rows||[]; if(cb) cb(_legalMembers); }).withFailureHandler(function(){ _legalMembers=[]; if(cb) cb([]); }).getLegalMembers();}
function doChangeAssignee(){if(!_selectedInq) return;var sel=document.getElementById('inq-assignee-select');var email=sel?sel.value:'';if(!email){showAlert('담당자를 선택해주세요.',{title:'선택 필요',icon:'⚠️'});return;}google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var selectedOption=sel?sel.options[sel.selectedIndex]:null;var assigneeName=selectedOption?selectedOption.text:email.split('@')[0];var row=_inqAll.find(function(r){return r.id===_selectedInq.id;});if(row){row.assignee=assigneeName;_selectedInq=row;}document.getElementById('inq-progress-info').innerHTML='🔵 <strong>'+esc(assigneeName)+'</strong>님이 진행 중입니다. 답변을 이어서 작성하거나 전송할 수 있습니다.';renderInqTable(_inqFiltered.length?_inqFiltered:_inqAll);}else{showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'변경 실패',icon:'❌'});}}).withFailureHandler(function(err){showAlert(err.message||String(err),{title:'오류',icon:'❌'});}).changeInquiryAssignee(_selectedInq.id,email);}
function showAutocomplete(inputId,listId){ var input=document.getElementById(inputId),list=document.getElementById(listId); var q=input.value.trim().toLowerCase(); if(!q||q.length<1){list.style.display='none';return;} loadMemberList(function(members){ var matched=members.filter(function(m){return m.name.toLowerCase().includes(q)||m.email.toLowerCase().includes(q);}).slice(0,8); if(!matched.length){list.style.display='none';return;} list.innerHTML=matched.map(function(m){return '<div class="autocomplete-item" onclick="selectAutocomplete(\''+inputId+'\',\''+listId+'\',\''+esc(m.email)+'\')"><div class="autocomplete-avatar">'+esc(m.name.charAt(0))+'</div><div><div class="autocomplete-name">'+esc(m.name)+'</div><div class="autocomplete-email">'+esc(m.email)+'</div></div></div>';}).join(''); list.style.display='block'; }); }
function showInqNameAc() {
var input = document.getElementById('inq-name');
var list = document.getElementById('inq-name-ac');
var q = input.value.trim().toLowerCase();
if (!q || q.length < 1) { list.style.display = 'none'; return; }
loadMemberList(function(members) {
var matched = members.filter(function(m) {return m.name.toLowerCase().includes(q);}).slice(0, 8);
if (!matched.length) { list.style.display = 'none'; return; }
list.innerHTML = matched.map(function(m) {return '<div class="autocomplete-item" onclick="selectInqName(\'' + esc(m.name) + '\',\'' + esc(m.dept || '') + '\')"><div class="autocomplete-avatar">' + esc(m.name.charAt(0)) + '</div><div><div class="autocomplete-name">' + esc(m.name) + '</div><div class="autocomplete-email">' + esc(m.dept || '') + '</div></div></div>';}).join('');
list.style.display = 'block';
});
}
function selectInqName(name, dept) {document.getElementById('inq-name').value = name;document.getElementById('inq-dept').value = dept;document.getElementById('inq-name-ac').style.display = 'none';checkInquiryReady();}
function selectAutocomplete(inputId,listId,email){document.getElementById(inputId).value=email;document.getElementById(listId).style.display='none';if(inputId==='ns-to-input') addNsRecipient('to');else if(inputId==='ns-cc-input') addNsRecipient('cc');else addRecipient(inputId==='recipient-input'?'to':'cc');}
function handleAcKeydown(e,inputId,listId,type){ if(e.key==='Enter'){e.preventDefault();var list=document.getElementById(listId);var first=list.querySelector('.autocomplete-item');if(first&&list.style.display!=='none')first.click();else{ if(type==='ns-to') addNsRecipient('to'); else if(type==='ns-cc') addNsRecipient('cc'); else addRecipient(type); }list.style.display='none';}else if(e.key==='Escape') document.getElementById(listId).style.display='none'; }
document.addEventListener('click',function(e){ ['to-ac','cc-ac','ns-to-ac','ns-cc-ac','inq-name-ac'].forEach(function(id){var el=document.getElementById(id);if(el&&!el.contains(e.target)) el.style.display='none';}); });
function showContractTypeSelect(){document.getElementById('contract-type-select-view').style.display='block';document.getElementById('contract-list-view').style.display='none';document.getElementById('contract-form-view').style.display='none';document.getElementById('contract-nonstandard-view').style.display='none';document.getElementById('contract-modified-review-view').style.display='none';}
function handleDeepLink() {
  if (INIT_PAGE === 'submit') {
    showPage('submit');
  }
  if (INIT_PAGE === 'reviewmgmt') {
    showPage('reviewmgmt');
    if (typeof INIT_REVIEW_ID !== 'undefined' && INIT_REVIEW_ID) {
      var waitForLoad = setInterval(function() {
        if (_revAll.length > 0 || document.getElementById('rev-tbody').textContent.indexOf('내역이 없습니다') >= 0) {
          clearInterval(waitForLoad);
          selectRev(INIT_REVIEW_ID);
        }
      }, 500);
    }
  }
  if (INIT_PAGE === 'myreview') {
    showPage('myreview');
    if (typeof INIT_REVIEW_ID !== 'undefined' && INIT_REVIEW_ID) {
      var waitForLoadMy = setInterval(function() {
        if (_myRevAll.length > 0 || document.getElementById('myrev-tbody').textContent.indexOf('내역이 없습니다') >= 0) {
          clearInterval(waitForLoadMy);
          selectMyRev(INIT_REVIEW_ID);
        }
      }, 500);
    }
  }
} {
  if (INIT_PAGE === 'submit') {
    showPage('submit');
  }
  if (INIT_PAGE === 'reviewmgmt') {
    showPage('reviewmgmt');
    if (typeof INIT_REVIEW_ID !== 'undefined' && INIT_REVIEW_ID) {
      var waitForLoad = setInterval(function() {
        if (_revAll.length > 0 || document.getElementById('rev-tbody').textContent.indexOf('내역이 없습니다') >= 0) {
          clearInterval(waitForLoad);
          selectRev(INIT_REVIEW_ID);
        }
      }, 500);
    }
  }
}

// ════════════════════════════════════════════════════════════
//  사용자 인증 게이트
// ════════════════════════════════════════════════════════════
function initAuth() {
  // 1. 서버에서 이메일 잡힌 경우 → 바로 통과
  if (USER_EMAIL) return;

  // 2. localStorage에서 복원
  var savedEmail = localStorage.getItem('loc_userEmail') || '';
  var savedName  = localStorage.getItem('loc_userName') || '';
  var savedId    = localStorage.getItem('loc_userId') || '';

  if (savedEmail && savedName) {
    USER_EMAIL = savedEmail;
    USER_NAME  = savedName;
    SLACK_USER_ID = savedId;
    return;
  }

  // 3. 이메일 입력 모달 표시
  showLoginGate();
}

function showLoginGate() {
  document.getElementById('login-gate-overlay').style.display = 'flex';
}

function submitLoginEmail() {
  var input = document.getElementById('login-email-input');
  var email = input.value.trim();

  if (!email || !email.includes('@')) {
    input.style.borderColor = '#e74c3c';
    setTimeout(function() { input.style.borderColor = '#ddd'; }, 1500);
    return;
  }

  input.disabled = true;

  google.script.run
    .withSuccessHandler(function(info) {
      input.disabled = false;

      if (info) {
        // ✅ 등록된 사용자
        USER_EMAIL    = email;
        USER_NAME     = info.name || '';
        SLACK_USER_ID = info.slackId || '';

        localStorage.setItem('loc_userEmail', USER_EMAIL);
        localStorage.setItem('loc_userName', USER_NAME);
        localStorage.setItem('loc_userId', SLACK_USER_ID);

        document.getElementById('login-gate-overlay').style.display = 'none';

        // 문의하기 이름/부서 자동채우기 갱신
        var nameEl = document.getElementById('inq-name');
        if (nameEl && USER_NAME) { nameEl.value = USER_NAME; nameEl.readOnly = true; }
      } else {
        // ❌ 미등록
        showUnregisteredModal(email);
      }
    })
    .withFailureHandler(function() {
      input.disabled = false;
      showAlert('서버 연결에 실패했습니다. 다시 시도해주세요.', { title: '오류', icon: '❌' });
    })
    .getUserInfoByEmail(email);
}

function showUnregisteredModal(email) {
  document.getElementById('login-gate-overlay').style.display = 'none';
  document.getElementById('unregistered-overlay').style.display = 'flex';
  document.getElementById('unregistered-email-display').textContent = email;
  document.getElementById('unregistered-overlay').dataset.email = email;
}

function retryLoginEmail() {
  document.getElementById('unregistered-overlay').style.display = 'none';
  document.getElementById('login-email-input').value = '';
  document.getElementById('login-gate-overlay').style.display = 'flex';
}

function requestRegistration() {
  var email = document.getElementById('unregistered-overlay').dataset.email;
  var btn = document.querySelector('#unregistered-overlay button');
  btn.disabled = true;
  btn.textContent = '요청 중...';

  google.script.run
    .withSuccessHandler(function(result) {
      btn.disabled = false;
      btn.textContent = '📩 법무실로 등록 요청하기';

      if (result && result.ok) {
        document.getElementById('unregistered-overlay').innerHTML =
        '<div style="background:white; border-radius:12px; padding:36px 28px; max-width:400px; width:90%; text-align:center;">' +
        '<div style="font-size:2rem; margin-bottom:12px;">✅</div>' +
        '<h3 style="font-family:var(--font); font-size:1.05rem; font-weight:700; color:#1c2333; margin-bottom:10px;">등록 요청 완료</h3>' +
        '<p style="font-size:0.85rem; color:#666;">법무실에 등록 요청이 전달되었습니다.<br>등록 완료 후 Slack 또는 이메일로 안내드리겠습니다.</p>' +
        '<button onclick="location.reload()" style="margin-top:20px; padding:10px 24px; background:#1c2333; color:white; border:none; border-radius:8px; font-size:0.85rem; cursor:pointer;">확인</button>' +
        '</div>';
      } else {
        showAlert('요청 전송에 실패했습니다. 법무실에 직접 문의해주세요.', { title: '전송 실패', icon: '❌' });
      }
    })
    .withFailureHandler(function() {
      btn.disabled = false;
      btn.textContent = '📩 법무실로 등록 요청하기';
      showAlert('서버 연결에 실패했습니다.', { title: '오류', icon: '❌' });
    })
    .requestMemberRegistration(email);
}

function autoSelectSubmitRowFromUrl() {if (!INIT_ROWNUM) return;var num = Number(INIT_ROWNUM);if (!num) return;var exists = allRows.find(function(r) { return r.rowNum === num; });if (exists) {selectRow(num);}INIT_ROWNUM = '';}

// ════════════════════════════════════════════════════════════
//  참고 자료 PDF 뷰어
// ════════════════════════════════════════════════════════════
var REF_FILES = {
'approval_igaw': '1CaV7TZakwmEG0Yhc8wWxvGuK7hyMvm_O',
'approval_adp':  '1D8RR2W4W88bE0yEIac13d1WbOSRT4vny',
'manual':        '1Mv_ziZo-v5F49tYBCqmtC92yeg2F2Ji_',
'guide':         '1TChR3HSecQX6ZSJsUiVu--O7lW-rUmZ2'
};
function openRef(type) {
var title = document.getElementById('ref-modal-title');
var tabs = document.getElementById('ref-modal-tabs');
if (type === 'approval') {
title.textContent = '전결규정';
tabs.style.display = 'flex';
tabs.innerHTML = '<button class="company-tab active" onclick="switchRefTab(\'approval_igaw\',this)" style="padding:5px 16px;font-size:0.8rem;">IGAW</button><button class="company-tab" onclick="switchRefTab(\'approval_adp\',this)" style="padding:5px 16px;font-size:0.8rem;">ADP</button>';
loadRefPdf('approval_igaw');
} else if (type === 'manual') {
title.textContent = '법무 매뉴얼';
tabs.style.display = 'none';
loadRefPdf('manual');
} else if (type === 'guide') {
title.textContent = '계약서 작성 가이드';
tabs.style.display = 'none';
loadRefPdf('guide');
}
var notice = document.getElementById('preview-page-notice');
if (notice) notice.style.display = 'none';
document.getElementById('ref-modal-overlay').style.display = 'flex';
}
function downloadRef(key) {
  var fileId = REF_FILES[key];
  if (!fileId) return;
  var url = 'https://drive.google.com/uc?export=download&id=' + fileId;
  var a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.click();
}
function openRefSingle(key) {
  var fileId = REF_FILES[key];
  if (!fileId) return;
  var titles = {
    'approval_igaw': 'IGAW 전결규정',
    'approval_adp': 'ADP 전결규정',
    'manual': '법무 매뉴얼',
    'guide': '계약서 작성 가이드'
  };
  document.getElementById('ref-modal-title').textContent = titles[key] || '참고 자료';
  document.getElementById('ref-modal-tabs').style.display = 'none';
  document.getElementById('ref-modal-iframe').src = 'https://drive.google.com/file/d/' + fileId + '/preview';
  var notice = document.getElementById('preview-page-notice');
  if (notice) notice.style.display = 'none';
  document.getElementById('ref-modal-overlay').style.display = 'flex';
}
function switchRefTab(key, btn) {var tabs = document.getElementById('ref-modal-tabs');tabs.querySelectorAll('.company-tab').forEach(function(t){ t.classList.remove('active'); });btn.classList.add('active');loadRefPdf(key);}
function loadRefPdf(key) {var fileId = REF_FILES[key];if (!fileId) return;document.getElementById('ref-modal-iframe').src = 'https://drive.google.com/file/d/' + fileId + '/preview';}
function closeRefModal() {document.getElementById('ref-modal-overlay').style.display = 'none';document.getElementById('ref-modal-iframe').src = '';  var notice = document.getElementById('preview-page-notice'); if (notice) notice.style.display = 'none';}
// ════════════════════════════════════════════════════════════
//  홈 대시보드
// ════════════════════════════════════════════════════════════
function loadDashboard() {
document.getElementById('inq-dash-count').textContent = '로드 중...';
document.getElementById('rev-dash-count').textContent = '로드 중...';
document.getElementById('dash-inq-tbody').innerHTML = '<tr><td colspan="6"><div class="dash-empty">\u23f3 로드 중...</div></td></tr>';
document.getElementById('dash-rev-tbody').innerHTML = '<tr><td colspan="7"><div class="dash-empty">\u23f3 로드 중...</div></td></tr>';
google.script.run.withSuccessHandler(function(result) {
if (!result || !result.ok) return;
renderDashboard(result.inquiries || [], result.reviews || []);
}).withFailureHandler(function() {
document.getElementById('inq-dash-count').textContent = '오류';
document.getElementById('rev-dash-count').textContent = '오류';
}).getDashboardData();
}
// 회신완료를 검토·진행중 카운트에 합산
function renderDashboard(inquiries, reviews) {
document.getElementById('sc-inq-pending').textContent  = inquiries.filter(function(r){return r.status==='\ubbf8\ub2f5\ubcc0' && !r.assignee;}).length;
document.getElementById('sc-inq-progress').textContent = inquiries.filter(function(r){return r.status!=='\ubbf8\ub2f5\ubcc0' || r.assignee;}).length;
document.getElementById('sc-rev-pending').textContent  = reviews.filter(function(r){return !r.status||r.status==='\uac80\ud1a0\ub300\uae30';}).length;
// 검토·진행중 = 검토중 + 회신완료
document.getElementById('sc-rev-progress').textContent = reviews.filter(function(r){return r.status==='검토중'||r.status==='재검토중'||r.status==='회신완료';}).length;
document.getElementById('sc-rev-agreed').textContent   = reviews.filter(function(r){return r.status==='\ud569\uc758\uc644\ub8cc';}).length;
document.getElementById('inq-dash-count').textContent  = '\ucd1d ' + inquiries.length + '\uac74';
document.getElementById('rev-dash-count').textContent  = '\ucd1d ' + reviews.length + '\uac74';
_dashInqData = inquiries; _dashInqPage = 1;
_dashRevData = reviews;   _dashRevPage = 1;
renderDashInqPage();
renderDashRevPage();
}
function fmtDateShort(v) {
if (!v) return '\u2014';
var s = String(v).trim();
if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
var d = new Date(s);
if (isNaN(d.getTime())) return s;
return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
var _dashInqData = [], _dashRevData = [], _dashInqPage = 1, _dashRevPage = 1;
var DASH_PAGE = 5;
function renderDashInqPage() {
var data = _dashInqData;
var total = Math.max(1, Math.ceil(data.length / DASH_PAGE));
var items = data.slice((_dashInqPage-1)*DASH_PAGE, _dashInqPage*DASH_PAGE);
var tbody = document.getElementById('dash-inq-tbody');
if (!data.length) {
tbody.innerHTML = '<tr><td colspan="6"><div class="dash-empty">\u2705 미처리 문의가 없습니다</div></td></tr>';
document.getElementById('inq-pagination').style.display = 'flex';
return;
}
tbody.innerHTML = items.map(function(r) {
var bc = r.status==='\uc9c4\ud589\uc911' ? 'inq-status-progress' : 'inq-status-pending';
return '<tr><td style="font-weight:600;text-align:center;">' + esc(r.name) + '</td>' +
'<td style="font-size:0.78rem;color:var(--text-muted);text-align:center;white-space:nowrap;">' + esc(r.category||'') + '</td>' +
'<td class="col-name">' + esc(r.title) + '</td>' +
'<td class="hide-mobile" style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap;text-align:center;">' + fmtDateShort(r.date) + '</td>' +
'<td style="text-align:center;"><span class="inq-status-badge ' + bc + '">' + esc(r.status||'\ubbf8\ub2f5\ubcc0') + '</span></td>' +
'<td class="hide-mobile" style="font-size:0.8rem;color:var(--text-muted);text-align:center;">' + esc(r.assignee||'\u2014') + '</td></tr>';
}).join('');
var pg = document.getElementById('inq-pagination');
pg.style.display = 'flex';
document.getElementById('inq-pg-info').textContent = _dashInqPage + ' / ' + total;
document.getElementById('inq-prev').disabled = _dashInqPage <= 1;
document.getElementById('inq-next').disabled = _dashInqPage >= total;
}
function renderDashRevPage() {
var data = _dashRevData;
var total = Math.max(1, Math.ceil(data.length / DASH_PAGE));
var items = data.slice((_dashRevPage-1)*DASH_PAGE, _dashRevPage*DASH_PAGE);
var tbody = document.getElementById('dash-rev-tbody');
if (!data.length) {
tbody.innerHTML = '<tr><td colspan="7"><div class="dash-empty">\u2705 미처리 검토 요청이 없습니다</div></td></tr>';
document.getElementById('rev-pagination').style.display = 'flex';
return;
}
tbody.innerHTML = items.map(function(r) {
var bc = r.status==='검토중' ? 'rev-status-inprogress' : r.status==='재검토중' ? 'rev-status-rereviewing' : r.status==='회신완료' ? 'rev-status-replied' : r.status==='합의완료' ? 'rev-status-agreed' : 'rev-status-pending';
var revTypeLabel = r.contractType === 'nonstandard' ? '\ube44\ud45c\uc900' : '\ud45c\uc900';
var partyLabel = r.contractParty || '\u2014';
return '<tr><td style="font-weight:600;text-align:center;">' + esc(r.requesterName) + '</td>' +
'<td style="text-align:center;">' + esc(partyLabel) + '</td>' +
'<td style="text-align:center;">' + revTypeLabel + '</td>' +
'<td class="col-name">' + esc(r.contractName) + '</td>' +
'<td class="hide-mobile" style="text-align:center;">' + fmtDateShort(r.requestDate) + '</td>' +
'<td style="text-align:center;"><span class="rev-status-badge ' + bc + '">' + esc(r.status||'\uac80\ud1a0\ub300\uae30') + '</span></td>' +
'<td class="hide-mobile" style="text-align:center;">' + esc(r.confirmedBy||'\u2014') + '</td></tr>';
}).join('');
var pg = document.getElementById('rev-pagination');
pg.style.display = 'flex';
document.getElementById('rev-pg-info').textContent = _dashRevPage + ' / ' + total;
document.getElementById('rev-prev').disabled = _dashRevPage <= 1;
document.getElementById('rev-next').disabled = _dashRevPage >= total;
}
function changeDashPage(type, dir) {
if (type === 'inq') { _dashInqPage += dir; renderDashInqPage(); }
else                { _dashRevPage += dir; renderDashRevPage(); }
}
// ════════════════════════════════════════════════════════════
//  스냅 내비게이션
// ════════════════════════════════════════════════════════════
function scrollToSnap(idx) {var s = document.querySelectorAll('#page-home .snap-section');if (s[idx]) s[idx].scrollIntoView({ behavior: 'smooth' });}
function setSnapHeight() {var tb = document.querySelector('.topbar');var hd = document.querySelector('header');var h  = window.innerHeight - (tb ? tb.offsetHeight : 0) - (hd ? hd.offsetHeight : 0);document.documentElement.style.setProperty('--snap-h', h + 'px');}
function initSnapNav() {
var homeEl = document.getElementById('page-home');
if (!homeEl) return;
var sections = homeEl.querySelectorAll('.snap-section');
var dots     = document.querySelectorAll('#snap-nav .snap-dot');
var observer = new IntersectionObserver(function(entries) {
entries.forEach(function(entry) {
if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
var idx = Array.from(sections).indexOf(entry.target);
dots.forEach(function(d, i) { d.classList.toggle('active-dot', i === idx); });
}
});
}, { root: homeEl, threshold: 0.5 });
sections.forEach(function(s) { observer.observe(s); });
}
// ════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════
document.getElementById('page-home').innerHTML = PAGE_TEMPLATES.home;
document.getElementById('page-contract').innerHTML = PAGE_TEMPLATES.contract;
document.getElementById('page-submit').innerHTML = PAGE_TEMPLATES.submit;
document.getElementById('page-inquiry').innerHTML = PAGE_TEMPLATES.inquiry;
document.getElementById('page-myinquiry').innerHTML = PAGE_TEMPLATES.myinquiry;
document.getElementById('page-inqmgmt').innerHTML = PAGE_TEMPLATES.inqmgmt;
document.getElementById('page-reviewmgmt').innerHTML = PAGE_TEMPLATES.reviewmgmt;
document.getElementById('page-myreview').innerHTML = PAGE_TEMPLATES.myreview;
document.getElementById('page-reference').innerHTML = PAGE_TEMPLATES.reference;
document.getElementById('modals-container').innerHTML = PAGE_TEMPLATES.modals;
Array.from(document.body.childNodes).forEach(function(n){
if(n.nodeType===3 && n.textContent.trim()) n.remove();
});
document.getElementById('today-date').textContent = new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
CONTRACTS = CONTRACTS_DATA || [];
renderContractGrid();
if (IS_LEGAL_TEAM === 'true') {
document.getElementById('nav-inqmgmt').style.display = 'block';
document.getElementById('nav-reviewmgmt').style.display = 'block';
document.getElementById('nav-myreview').style.display = 'block';
} else {
document.getElementById('nav-myinquiry').style.display = 'block';
document.getElementById('nav-myreview').style.display = 'block';
}
history.pushState(null, '', location.href);
window.addEventListener('popstate', function() { history.pushState(null, '', location.href); });
setSnapHeight();
window.addEventListener('resize', setSnapHeight);
var heroEl  = document.querySelector('.hero');
var snapNav = document.getElementById('snap-nav');
var footerEl = document.querySelector('footer');
if (heroEl)   heroEl.style.display  = 'none';
if (snapNav)  snapNav.className     = 'visible';
if (footerEl) footerEl.style.display = 'none';
document.body.style.overflow   = 'hidden';
document.body.style.background = '#0d1117';
initSnapNav();
loadDashboard();
_dashInterval = setInterval(loadDashboard, 3 * 60 * 1000);
handleDeepLink();
initAuth();
// ── 미리보기 ──
async function previewCurrentContract() {
if (!currentContract || !validateCurrentForm()) {
showAlert('\uD544\uC218 \uD56D\uBAA9\uC744 \uBAA8\uB450 \uC785\uB825\uD574\uC8FC\uC138\uC694.', { title: '\uC785\uB825 \uD544\uC694', icon: '\u26A0\uFE0F' });
return;
}
var previewBtn = document.getElementById('preview-btn');
if (previewBtn) { previewBtn.disabled = true; previewBtn.textContent = '\uBBF8\uB9AC\uBCF4\uAE30 \uC0DD\uC131 \uC911...'; }
var raw = collectFormData();
var toKo = function(d) { if (!d) return ''; var p = d.split('-'); return p.length === 3 ? p[0] + '\uB144 ' + p[1] + '\uC6D4 ' + p[2] + '\uC77C' : d; };
var fmtN = function(n) { var s = String(n).replace(/[^0-9]/g, ''); return s ? Number(s).toLocaleString('ko-KR') : ''; };
var dateF=['contract_date','service_start','service_end','ad_start','ad_end','media_start','media_end','reward_start','reward_end','original_contract_date','SIGN_DATE','sign_date','agreement_start','agreement_end','start_date','end_date'];
var numF = ['service_cost','total_amount','monthly_fee','contract_amount','ad_budget','cpa_rate'];
var payload = { contractType: currentContract.id, contractName: currentContract.name };
Object.keys(raw).forEach(function(k) {
if (dateF.includes(k)) payload[k] = toKo(raw[k]);
else if (numF.includes(k)) payload[k] = fmtN(raw[k]);
else payload[k] = Array.isArray(raw[k]) ? raw[k].join(', ') : raw[k];
});
payload.remarks = (payload.remarks && payload.remarks.trim()) || '\uC5C6\uC74C';
payload.invoice_date = payload.invoice_date || '\uC6A9\uC5ED \uC644\uB8CC \uC6D4\uC758 \uB9D0\uC77C';
payload.payment_date = payload.payment_date || '\uC138\uAE08\uACC4\uC0B0\uC11C \uBC1C\uD589\uC77C \uAE30\uC900 \uC775\uC6D4 \uB9D0\uC77C \uC774\uB0B4';
payload.userEmail = USER_EMAIL || '';
try {
var result = await new Promise(function(resolve, reject) {
google.script.run.withSuccessHandler(resolve).withFailureHandler(function(err) { reject(new Error(err.message || '\uBBF8\uB9AC\uBCF4\uAE30 \uC0DD\uC131 \uC2E4\uD328')); }).previewContract(JSON.stringify(payload));
});
if (!result || !result.ok) throw new Error((result && result.error) || '\uBBF8\uB9AC\uBCF4\uAE30 \uC0DD\uC131 \uC2E4\uD328');
document.getElementById('ref-modal-title').textContent = currentContract.name + ' \uBBF8\uB9AC\uBCF4\uAE30';
document.getElementById('ref-modal-tabs').style.display = 'none';
document.getElementById('ref-modal-iframe').src = 'https://docs.google.com/document/d/' + result.fileId + '/preview';
// ↓ 이 블록 추가 ↓
var notice = document.getElementById('preview-page-notice');
if (!notice) {
  notice = document.createElement('div');
  notice.id = 'preview-page-notice';
  notice.style.cssText = 'background:#FFF8E1;border:1px solid #FFE082;border-radius:6px;padding:8px 14px;margin:0 16px 12px;font-size:0.78rem;color:#5D4037;display:flex;align-items:center;gap:6px;';
  notice.innerHTML = '<span>ℹ️</span><span>미리보기는 실제 생성되는 계약서와 일부 상이할 수 있습니다.</span>';
  var iframe = document.getElementById('ref-modal-iframe');
  iframe.parentNode.insertBefore(notice, iframe);
}
notice.style.display = 'flex';  
document.getElementById('ref-modal-overlay').style.display = 'flex';
} catch(e) {
showAlert(e.message, { title: '\uBBF8\uB9AC\uBCF4\uAE30 \uC624\uB958', icon: '\u274C' });
} finally {
if (previewBtn) { previewBtn.disabled = false; previewBtn.textContent = '\uBBF8\uB9AC\uBCF4\uAE30'; }
}
}

// ── 수정본 검토 요청 ──
var _modAttachFiles = [];
window._modToList = [];
window._modCcList = [];

function requestModifiedReview(contractId, contractName, company) {
document.getElementById('contract-type-select-view').style.display = 'none';
document.getElementById('contract-list-view').style.display = 'none';
document.getElementById('contract-form-view').style.display = 'none';
document.getElementById('contract-nonstandard-view').style.display = 'none';
var view = document.getElementById('contract-modified-review-view');
view.style.display = 'block';
resetModifiedForm();
document.getElementById('mod-contract-party').textContent = company;
document.getElementById('mod-contract-party-val').value = company;
document.getElementById('mod-contract-name').textContent = contractName + ' (\uC218\uC815\uBCF8)';
document.getElementById('mod-contract-name-val').value = contractName + ' (\uC218\uC815\uBCF8)';
document.getElementById('mod-contract-id').value = contractId;
window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetModifiedForm() {
_modAttachFiles = [];
window._modToList = [];
window._modCcList = [];
renderModAttachList();
['mod-counter-party', 'mod-opinion', 'mod-to-input', 'mod-cc-input'].forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ''; });
['mod-to-tags', 'mod-cc-tags'].forEach(function(id) { var el = document.getElementById(id); if (el) el.innerHTML = ''; });
['mod-to-ac', 'mod-cc-ac'].forEach(function(id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; });
var btn = document.getElementById('mod-submit-btn');
if (btn) { btn.disabled = true; btn.textContent = '\uAC80\uD1A0 \uC694\uCCAD \u2192'; }
}
function showModifiedReviewBack() {
  doShowContractList_();
}
function handleModFileSelect(e) {
var files = Array.from(e.target.files || []);
e.target.value = '';
files.forEach(function(f) {
if (f.size > 20 * 1024 * 1024) { showAlert(f.name + '\n\uD30C\uC77C \uD06C\uAE30\uAC00 20MB\uB97C \uCD08\uACFC\uD569\uB2C8\uB2E4.', { title: '\uD30C\uC77C \uD06C\uAE30 \uCD08\uACFC', icon: '\u26A0\uFE0F' }); return; }
_modAttachFiles.push({ file: f, name: f.name, size: f.size, mimeType: f.type || 'application/octet-stream' });
});
renderModAttachList();
checkModReady();
}

function removeModAttach(idx) { _modAttachFiles.splice(idx, 1); renderModAttachList(); checkModReady(); }

function renderModAttachList() {
var el = document.getElementById('mod-attach-list');
if (!el) return;
el.innerHTML = _modAttachFiles.map(function(a, i) {
return '<div class="attach-file-item"><span style="font-size:1rem;">\uD83D\uDCC4</span><span class="afi-name">' + esc(a.name) + '</span><span class="afi-size">' + (a.size / 1024 / 1024).toFixed(2) + ' MB</span><button class="afi-remove" onclick="removeModAttach(' + i + ')">\u2715</button></div>';
}).join('');
}

function checkModReady() {
var ok = document.getElementById('mod-counter-party') && document.getElementById('mod-counter-party').value.trim() && _modAttachFiles.length > 0;
var btn = document.getElementById('mod-submit-btn');
if (btn) btn.disabled = !ok;
}

function addModRecipient(type) {
var inputId = type === 'to' ? 'mod-to-input' : 'mod-cc-input';
var tagsId = type === 'to' ? 'mod-to-tags' : 'mod-cc-tags';
var listKey = type === 'to' ? '_modToList' : '_modCcList';
var input = document.getElementById(inputId);
if (!input) return;
var email = input.value.trim().toLowerCase();
if (!email || !email.includes('@')) { input.style.borderColor = 'var(--red)'; setTimeout(function() { input.style.borderColor = ''; }, 1200); showAlert('\uC62C\uBC14\uB978 \uC774\uBA54\uC77C \uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.', { title: '\uC774\uBA54\uC77C \uD615\uC2DD \uC624\uB958', icon: '\u26A0\uFE0F' }); return; }
if (window[listKey].includes(email)) { input.value = ''; return; }
window[listKey].push(email);
input.value = '';
renderModRecipientTags(tagsId, listKey);
var acId = type === 'to' ? 'mod-to-ac' : 'mod-cc-ac';
document.getElementById(acId).style.display = 'none';
}

function removeModRecipient(type, email) {
var listKey = type === 'to' ? '_modToList' : '_modCcList';
var tagsId = type === 'to' ? 'mod-to-tags' : 'mod-cc-tags';
window[listKey] = window[listKey].filter(function(e) { return e !== email; });
renderModRecipientTags(tagsId, listKey);
}

function renderModRecipientTags(tagsId, listKey) {
var container = document.getElementById(tagsId);
if (!container) return;
container.innerHTML = (window[listKey] || []).map(function(email) {
return '<span class="recipient-tag">' + esc(email) + '<button onclick="removeModRecipient(\'' + (tagsId.includes('to') ? 'to' : 'cc') + '\',\'' + esc(email) + '\')" title="\uC81C\uAC70">\u2715</button></span>';
}).join('');
}

async function submitModifiedReview() {
var contractName = document.getElementById('mod-contract-name-val').value;
var contractParty = document.getElementById('mod-contract-party-val').value;
var counterParty = document.getElementById('mod-counter-party').value.trim();
var opinion = document.getElementById('mod-opinion') ? document.getElementById('mod-opinion').value.trim() : '';
if (!counterParty || !_modAttachFiles.length) { showAlert('\uD544\uC218 \uD56D\uBAA9\uC744 \uBAA8\uB450 \uC785\uB825\uD558\uACE0 \uD30C\uC77C\uC744 \uCCA8\uBD80\uD574\uC8FC\uC138\uC694.', { title: '\uC785\uB825 \uD544\uC694', icon: '\u26A0\uFE0F' }); return; }
var btn = document.getElementById('mod-submit-btn');
btn.disabled = true;
btn.textContent = '\uD30C\uC77C \uC5C5\uB85C\uB4DC \uC911...';
try {
var freshToken = await new Promise(function(resolve) { google.script.run.withSuccessHandler(resolve).withFailureHandler(function() { resolve(OAUTH_TOKEN); }).getFreshToken(); });
var activeToken = freshToken || OAUTH_TOKEN;
var uploadedFiles = [];
for (var i = 0; i < _modAttachFiles.length; i++) {
var a = _modAttachFiles[i];
btn.textContent = '\uD30C\uC77C \uC5C5\uB85C\uB4DC \uC911... (' + (i + 1) + '/' + _modAttachFiles.length + ')';
var initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', { method: 'POST', headers: { 'Authorization': 'Bearer ' + activeToken, 'Content-Type': 'application/json', 'X-Upload-Content-Type': a.mimeType, 'X-Upload-Content-Length': a.file.size }, body: JSON.stringify({ name: a.name }) });
if (!initRes.ok) throw new Error('Drive \uC138\uC158 \uC2DC\uC791 \uC2E4\uD328: ' + initRes.status);
var uploadUrl = initRes.headers.get('Location');
var uploadRes = await fetch(uploadUrl, { method: 'PUT', body: a.file });
if (!uploadRes.ok && uploadRes.status !== 200) throw new Error('\uC5C5\uB85C\uB4DC \uC2E4\uD328: ' + uploadRes.status);
var fileId = (await uploadRes.json()).id;
uploadedFiles.push({ name: a.name, fileId: fileId, url: 'https://drive.google.com/file/d/' + fileId + '/view' });
}
btn.textContent = '\uAC80\uD1A0 \uC694\uCCAD \uC911...';
await new Promise(function(resolve, reject) {
google.script.run.withSuccessHandler(function(result) { if (result && result.ok) resolve(result); else reject(new Error((result && result.error) || '\uAC80\uD1A0 \uC694\uCCAD \uC2E4\uD328')); }).withFailureHandler(function(err) { reject(new Error(err.message || '\uAC80\uD1A0 \uC694\uCCAD \uC2E4\uD328')); }).submitNonStandardReview({ contractName: contractName, counterParty: counterParty, contractParty: contractParty, contractType: 'standard_modified', opinion: opinion, files: JSON.stringify(uploadedFiles), toList: JSON.stringify(window._modToList || []), ccList: JSON.stringify(window._modCcList || []), userEmail: USER_EMAIL || '', userName: USER_NAME || '' });
});
showAlert('\uBC95\uBB34\uC2E4\uC5D0 \uAC80\uD1A0 \uC694\uCCAD\uC774 \uC804\uB2EC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.', { title: '\uAC80\uD1A0 \uC694\uCCAD\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4!', icon: '\u2705', onClose: function() { showContractList(); } });
btn.disabled = false;
btn.textContent = '\uAC80\uD1A0 \uC694\uCCAD \u2192';
} catch (e) {
showAlert(e.message, { title: '\uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4', icon: '\u274C' });
btn.disabled = false;
btn.textContent = '\uAC80\uD1A0 \uC694\uCCAD \u2192';
}
}

var _myRevAll = [], _myRevFiltered = [], _mySelectedRev = null;
var _myRevReReviewFiles = [];

// ── 내 검토 현황 로드 ──
function loadMyReviews() {
  _mySelectedRev = null;
  document.getElementById('myrev-detail-panel').style.display = 'none';
  document.getElementById('myrev-list-count').textContent = '로드 중...';
  document.getElementById('myrev-tbody').innerHTML = '<tr><td colspan="7"><div class="dash-empty">⏳ 로드 중...</div></td></tr>';

  google.script.run
    .withSuccessHandler(function(rows) {
      var myEmail = (USER_EMAIL || '').toLowerCase();
      // 요청자 본인 + TO/CC 수신자로 지정된 건도 포함
      _myRevAll = (rows || []).filter(function(r) {
        // 1. 내가 요청자인 경우
        if (r.requesterEmail && r.requesterEmail.toLowerCase() === myEmail) return true;
        // 2. 내가 TO 수신자인 경우
        if (r.toList && r.toList.toLowerCase().includes(myEmail)) return true;
        // 3. 내가 CC 참조자인 경우
        if (r.ccList && r.ccList.toLowerCase().includes(myEmail)) return true;
        return false;
      });
      _myRevFiltered = _myRevAll;
      renderMyRevTable(_myRevAll);
    })
    .withFailureHandler(function(err) {
      document.getElementById('myrev-tbody').innerHTML = '<tr><td colspan="7"><div class="list-empty"><div class="empty-icon">⚠️</div><p>로드 실패: ' + esc(err.message || String(err)) + '</p></div></td></tr>';
      document.getElementById('myrev-list-count').textContent = '—';
    })
    .getReviewRequests('all');
}

// ── 검색 필터 ──
function filterMyRevTable() {
  var q = document.getElementById('myrev-search').value.trim().toLowerCase();
  _myRevFiltered = q ? _myRevAll.filter(function(r) {
    return r.contractName.toLowerCase().includes(q);
  }) : _myRevAll;
  renderMyRevTable(_myRevFiltered);
}

// ── 테이블 렌더링 ──
function renderMyRevTable(rows) {
  var tbody = document.getElementById('myrev-tbody');
  var pendingCount = rows.filter(function(r) { return !r.status || r.status === '검토대기'; }).length;
  var progressCount = rows.filter(function(r) { return r.status === '검토중' || r.status === '재검토중'; }).length;
  var repliedCount = rows.filter(function(r) { return r.status === '회신완료'; }).length;
  var agreedCount = rows.filter(function(r) { return r.status === '합의완료'; }).length;
  var doneCount = rows.filter(function(r) { return r.status === '검토완료'; }).length;

  var countText = '전체 ' + rows.length + '건';
  if (pendingCount > 0) countText += ' · 검토대기 ' + pendingCount + '건';
  if (progressCount > 0) countText += ' · 검토중 ' + progressCount + '건';
  if (repliedCount > 0) countText += ' · 회신완료 ' + repliedCount + '건';
  if (agreedCount > 0) countText += ' · 합의완료 ' + agreedCount + '건';
  if (doneCount > 0) countText += ' · 검토완료 ' + doneCount + '건';
  document.getElementById('myrev-list-count').textContent = countText;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="7"><div class="list-empty"><div class="empty-icon">📭</div><p>검토 요청 내역이 없습니다.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(function(r) {
    var isDone = r.status === '검토완료', isProgress = r.status === '검토중', isAgreed = r.status === '합의완료', isReplied = r.status === '회신완료', isReReviewing = r.status === '재검토중';
    var isSelected = _mySelectedRev && _mySelectedRev.id === r.id;
    var revBadgeClass = isDone ? 'rev-status-done' : isReplied ? 'rev-status-replied' : isReReviewing ? 'rev-status-rereviewing' : isProgress ? 'rev-status-inprogress' : isAgreed ? 'rev-status-agreed' : 'rev-status-pending';
    var partyLabel = r.contractParty || '—';
    var revTypeLabel = r.contractType === 'nonstandard' ? '비표준' : '표준';

    return '<tr data-id="' + esc(r.id) + '" onclick="selectMyRev(\'' + esc(r.id) + '\')" class="' + (isSelected ? 'selected' : '') + '">' +
      '<td class="col-radio"><input type="radio" class="row-radio" name="myrev-row" ' + (isSelected ? 'checked' : '') + ' onclick="event.stopPropagation();selectMyRev(\'' + esc(r.id) + '\')"></td>' +
      '<td style="text-align:center;">' + esc(partyLabel) + '</td>' +
      '<td style="text-align:center;">' + revTypeLabel + '</td>' +
      '<td class="col-rev-name" style="font-weight:500;">' + (r.requesterEmail && r.requesterEmail.toLowerCase() !== (USER_EMAIL||'').toLowerCase() ? '<span style="font-size:0.68rem;font-weight:700;color:#1c2333;background:transparent;border:1.5px solid #1c2333;padding:1px 6px;border-radius:6px;margin-right:6px;">CC</span>' : '') + esc(r.contractName) + '</td>' +
      '<td class="col-rev-date hide-mobile" style="font-size:0.8rem;color:var(--text-muted);text-align:center;">' + esc(fmtDateTimeKo(r.requestDate)) + '</td>' +
      '<td class="col-rev-status" style="text-align:center;"><span class="rev-status-badge ' + revBadgeClass + '">' + esc(r.status || '검토대기') + '</span></td>' +
      '<td class="col-rev-confirmed hide-mobile" style="font-size:0.82rem;color:var(--text-muted);text-align:center;">' + esc(r.confirmedBy || '—') + '</td>' +
      '</tr>';
  }).join('');
}

// ── 행 선택 ──
function selectMyRev(id) {
  var pool = _myRevFiltered.length ? _myRevFiltered : _myRevAll;
  _mySelectedRev = pool.find(function(r) { return r.id === id; }) || null;
  renderMyRevTable(pool);
  if (_mySelectedRev) renderMyRevDetailPanel();
}

function clearMyRevSel() {
  _mySelectedRev = null;
  renderMyRevTable(_myRevFiltered.length ? _myRevFiltered : _myRevAll);
  document.getElementById('myrev-detail-panel').style.display = 'none';
}

// ── 상세 패널 렌더링 ──
function renderMyRevDetailPanel() {
  var r = _mySelectedRev;
  var isReplied = r.status === '회신완료';
  var isDone = r.status === '검토완료';
  var isAgreed = r.status === '합의완료';
  var isProgress = r.status === '검토중';
  var isReReviewing = r.status === '재검토중';

  document.getElementById('myrev-detail-title').textContent = r.contractName;
  var badge = document.getElementById('myrev-detail-status-badge');
  badge.textContent = r.status || '검토대기';
  badge.className='rev-status-badge '+(isDone?'rev-status-done':isReReviewing?'rev-status-rereviewing':isProgress?'rev-status-inprogress':isReplied?'rev-status-replied':isAgreed?'rev-status-agreed':'rev-status-pending');

  document.getElementById('myrev-detail-meta').innerHTML = [
    { lbl: '요청자', val: r.requesterName || r.requesterEmail || '—' },
    { lbl: '요청일', val: fmtDateTimeKo(r.requestDate) },
    { lbl: '담당자', val: r.confirmedBy || '미배정' },
    { lbl: '상태', val: r.status || '검토대기' }
  ].map(function(f) { return '<div class="rev-meta-item"><div class="rev-meta-lbl">' + f.lbl + '</div><div class="rev-meta-val">' + esc(f.val) + '</div></div>'; }).join('');

  // 검토 의견
  var opinionWrap = document.getElementById('myrev-opinion-wrap');
  if (r.opinion) { opinionWrap.style.display = 'block'; document.getElementById('myrev-detail-opinion').textContent = r.opinion; }
  else { opinionWrap.style.display = 'none'; }

  // 파일 링크
  var fileWrap = document.getElementById('myrev-file-wrap');
  if (r.fileUrl || r.reviewCaseFolderId) {
    fileWrap.style.display = 'block';
    var fileLink = document.getElementById('myrev-file-link');
    fileLink.href = '#';
fileLink.textContent = '📥 계약서 검토 파일 열기 →';
fileLink.onclick = function(e) {
  e.preventDefault();
  var originalText = fileLink.textContent;
  fileLink.textContent = '불러오는 중...';

  google.script.run
    .withSuccessHandler(function(result) {
      fileLink.textContent = originalText;
      if (result && result.ok && result.downloadUrl) {
        window.location.href = result.downloadUrl;  // 새 탭 없이 현재 창에서 바로 다운로드
      } else {
        showAlert((result && result.error) || '파일을 찾을 수 없습니다.', { title: '다운로드 실패', icon: '❌' });
      }
    })
    .withFailureHandler(function(err) {
      fileLink.textContent = originalText;
      showAlert(err.message || String(err), { title: '오류', icon: '❌' });
    })
    .getLatestReviewFileUrl(r.id);

  return false;
};
  } else { fileWrap.style.display = 'none'; }


  // 파일 목록
  var filesWrap = document.getElementById('myrev-files-wrap');
  if (filesWrap && r.reviewCaseFolderId) {
    filesWrap.style.display = 'block';
    var listEl = document.getElementById('myrev-files-list');
    listEl.innerHTML = '<span style="color:var(--text-muted);">로드 중...</span>';
    google.script.run
      .withSuccessHandler(function(result) {
        if (result && result.ok && result.files && result.files.length > 0) {
          listEl.innerHTML = renderFileList(result.files);
        } else {
          listEl.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">파일이 없습니다.</span>';
        }
      })
      .withFailureHandler(function() { listEl.innerHTML = ''; })
      .getReviewFiles(r.id);
  } else if (filesWrap) { filesWrap.style.display = 'none'; }
      // 검토 의견 회신 이력
    var myRevHistoryWrap = document.getElementById('myrev-reply-history-wrap');
    if (myRevHistoryWrap) {
    myRevHistoryWrap.style.display = 'block';
    var myRevHistoryContent = document.getElementById('myrev-reply-history-content');
    myRevHistoryContent.innerHTML = '<span style="color:var(--text-muted);">로드 중...</span>';
    google.script.run
    .withSuccessHandler(function(result) {
      if (result && result.ok && result.history) {
        myRevHistoryContent.innerHTML = renderReplyHistoryCards(result.history);
      } else {
        myRevHistoryContent.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">아직 회신 이력이 없습니다.</span>';
      }
    })
    .withFailureHandler(function() {
      myRevHistoryContent.innerHTML = '';
      myRevHistoryWrap.style.display = 'none';
    })
    .getReviewReplyHistory(r.id);
  }
  // 액션 버튼 (회신완료 상태 + 요청자 본인에게만)
  var actionWrap = document.getElementById('myrev-action-wrap');
  var actionBtns = document.getElementById('myrev-action-buttons');
  var reReviewWrap = document.getElementById('myrev-rereview-wrap');
  reReviewWrap.style.display = 'none';
  _myRevReReviewFiles = [];

var isMyRequest = r.requesterEmail && r.requesterEmail.toLowerCase() === (USER_EMAIL || '').toLowerCase();
var isToRecipient = false, isCcRecipient = false;
try { var _toArr = JSON.parse(r.toList || '[]'); isToRecipient = _toArr.some(function(e){ return e.trim().toLowerCase() === (USER_EMAIL||'').toLowerCase(); }); } catch(e){}
try { var _ccArr = JSON.parse(r.ccList || '[]'); isCcRecipient = _ccArr.some(function(e){ return e.trim().toLowerCase() === (USER_EMAIL||'').toLowerCase(); }); } catch(e){}
var canReReview = isMyRequest || isToRecipient || isCcRecipient;
if (isReplied && canReReview) {
  actionWrap.style.display = 'block';
  actionBtns.innerHTML =
    '<button class="btn btn-gold" onclick="doMyAgreeReview()" style="font-size:0.84rem;padding:9px 20px;">✅ 합의완료</button>' +
    '<button class="btn btn-ghost" onclick="showMyReReviewForm()" style="font-size:0.84rem;padding:9px 20px;">🔄 재검토 요청</button>';
} else {
  actionWrap.style.display = 'none';
}

  // 후속조치 표시
  var nextActionWrap = document.getElementById('myrev-next-action-wrap');
  if (!nextActionWrap) {
    nextActionWrap = document.createElement('div');
    nextActionWrap.id = 'myrev-next-action-wrap';
    var detailBody = document.querySelector('#myrev-detail-panel .rev-detail-body');
    if (detailBody) detailBody.appendChild(nextActionWrap);
  }
  if (r.status === '검토완료' && r.nextAction) {
    var actionUrl = '';
    if (r.nextAction === '일반품의서' || r.nextAction === '전자계약품의') {
      actionUrl = 'https://wf.tigrison.com/enovator/gswf/webpage/approvalmain/mainform.aspx';
    } else if (r.nextAction === 'ERP 등록 및 계약등록/변경품의') {
      var party = (r.contractParty || '').toUpperCase();
      actionUrl = party === 'ADP'
        ? 'https://igaworks.operations.dynamics.com/?cmp=adp&mi=defaultdashboard'
        : 'https://igaworks.operations.dynamics.com/?cmp=IGA&mi=DefaultDashboard';
    }
    nextActionWrap.style.display = 'block';
    nextActionWrap.innerHTML =
      '<div style="margin-top:16px;padding:16px;border:1.5px solid var(--gold);border-radius:12px;background:var(--gold-dim);">' +
      '<div style="font-family:var(--font);font-size:0.78rem;font-weight:700;color:var(--gold);margin-bottom:8px;">📋 후속 조치</div>' +
      '<a href="' + actionUrl + '" target="_blank" class="btn btn-gold" style="display:inline-block;font-size:0.85rem;padding:10px 20px;text-decoration:none;">' + r.nextAction + ' 진행하기 →</a>' +
      '</div>';
  } else {
    nextActionWrap.style.display = 'none';
  }

  var panel = document.getElementById('myrev-detail-panel');
  panel.style.display = 'block';
  setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);
}

// ── 합의완료 ──
function doMyAgreeReview() {
  if (!_mySelectedRev) return;
  showConfirm(
    '합의 완료 처리하시겠습니까?\n법무실에 합의 완료 사실이 전달됩니다.',
    {
      title: _mySelectedRev.contractName,
      icon: '✅',
      okLabel: '합의 완료',
      onOk: function() {
        google.script.run
          .withSuccessHandler(function(result) {
            if (result && result.ok) {
              var row = _myRevAll.find(function(r) { return r.id === _mySelectedRev.id; });
              if (row) { row.status = '합의완료'; _mySelectedRev = row; }
              renderMyRevTable(_myRevFiltered.length ? _myRevFiltered : _myRevAll);
              renderMyRevDetailPanel();
            } else {
              showAlert((result && result.error) || '알 수 없는 오류', { title: '처리 실패', icon: '❌' });
            }
          })
          .withFailureHandler(function(err) {
            showAlert(err.message || String(err), { title: '오류', icon: '❌' });
          })
          .agreeReview(_mySelectedRev.id);
      }
    }
  );
}

// ── 재검토 요청 폼 표시 ──
function showMyReReviewForm() {
  document.getElementById('myrev-rereview-wrap').style.display = 'block';
  _myRevReReviewFiles = [];
  renderMyRevReReviewAttachList();
  // 의견 textarea가 없으면 동적 생성
  var wrap = document.getElementById('myrev-rereview-wrap');
  if (!document.getElementById('myrev-rereview-opinion')) {
    // wrap의 첫 번째 자식 앞에 삽입 (label/input 바깥)
    var firstChild = wrap.firstElementChild;
    var opinionHtml =
      '<textarea id="myrev-rereview-opinion" placeholder="재검토 요청 의견을 입력하세요 (선택)" ' +
      'style="width:100%;min-height:80px;margin-bottom:12px;padding:12px;border:1.5px solid var(--border);border-radius:10px;font-family:var(--font);font-size:0.85rem;resize:vertical;box-sizing:border-box;"></textarea>';
    if (firstChild) {
      firstChild.insertAdjacentHTML('beforebegin', opinionHtml);
    } else {
      wrap.insertAdjacentHTML('afterbegin', opinionHtml);
    }
  } else {
    document.getElementById('myrev-rereview-opinion').value = '';
  }
}

function cancelMyReReview() {
  document.getElementById('myrev-rereview-wrap').style.display = 'none';
  _myRevReReviewFiles = [];
  renderMyRevReReviewAttachList();
}

// ── 재검토 첨부파일 핸들러 ──
function handleMyRevReReviewAttach(e) {
  var files = Array.from(e.target.files || []);
  e.target.value = '';
  files.forEach(function(f) {
    if (f.size > 20 * 1024 * 1024) {
      showAlert(f.name + '\n파일 크기가 20MB를 초과합니다.', { title: '파일 크기 초과', icon: '⚠️' });
      return;
    }
    _myRevReReviewFiles.push({ file: f, name: f.name, size: f.size, mimeType: f.type || 'application/octet-stream' });
  });
  renderMyRevReReviewAttachList();
}

function renderMyRevReReviewAttachList() {
  var el = document.getElementById('myrev-rereview-attach-list');
  if (!el) return;
  el.innerHTML = _myRevReReviewFiles.map(function(a, i) {
    return '<div class="attach-file-item"><span style="font-size:1rem;">📄</span><span class="afi-name">' + esc(a.name) + '</span><span class="afi-size">' + (a.size / 1024 / 1024).toFixed(2) + ' MB</span><button class="afi-remove" onclick="_myRevReReviewFiles.splice(' + i + ',1);renderMyRevReReviewAttachList();">✕</button></div>';
  }).join('');
}

// ── 재검토 요청 전송 ──
async function doMyRequestReReview() {
  if (!_mySelectedRev) return;
  var btn = document.getElementById('myrev-rereview-submit-btn');
  btn.disabled = true; btn.textContent = '처리 중...';

  try {
    // 파일 업로드 (있으면)
    var uploadedFiles = [];
    if (_myRevReReviewFiles.length > 0) {
      btn.textContent = '파일 업로드 중...';
      var freshToken = await new Promise(function(resolve) {
        google.script.run.withSuccessHandler(resolve).withFailureHandler(function() { resolve(OAUTH_TOKEN); }).getFreshToken();
      });
      var activeToken = freshToken || OAUTH_TOKEN;

      for (var i = 0; i < _myRevReReviewFiles.length; i++) {
        var a = _myRevReReviewFiles[i];
        var initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + activeToken, 'Content-Type': 'application/json', 'X-Upload-Content-Type': a.mimeType, 'X-Upload-Content-Length': a.file.size },
          body: JSON.stringify({ name: a.name })
        });
        if (!initRes.ok) throw new Error('Drive 세션 시작 실패: ' + initRes.status);
        var uploadUrl = initRes.headers.get('Location');
        var uploadRes = await fetch(uploadUrl, { method: 'PUT', body: a.file });
        if (!uploadRes.ok && uploadRes.status !== 200) throw new Error('업로드 실패: ' + uploadRes.status);
        var fileId = (await uploadRes.json()).id;
        uploadedFiles.push({ name: a.name, fileId: fileId });
      }
    }

    btn.textContent = '재검토 요청 중...';
    await new Promise(function(resolve, reject) {
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.ok) resolve(result);
          else reject(new Error((result && result.error) || '재검토 요청 실패'));
        })
        .withFailureHandler(function(err) { reject(new Error(err.message || '재검토 요청 실패')); })
        .requestReReview(_mySelectedRev.id, {
          uploadedFileIds: JSON.stringify(uploadedFiles.map(function(f) { return f.fileId; })),
          opinion: (document.getElementById('myrev-rereview-opinion') ? document.getElementById('myrev-rereview-opinion').value : '')});
    });

    // 성공
    var row = _myRevAll.find(function(r) { return r.id === _mySelectedRev.id; });
    if (row) { row.status = '재검토중'; _mySelectedRev = row; }
    renderMyRevTable(_myRevFiltered.length ? _myRevFiltered : _myRevAll);
    cancelMyReReview();
    renderMyRevDetailPanel();
    showAlert('재검토 요청이 전달되었습니다.', { title: '재검토 요청 완료', icon: '✅' });
  } catch(e) {
    showAlert(e.message, { title: '오류', icon: '❌' });
  }

  btn.disabled = false; btn.textContent = '🔄 재검토 요청 전송';
}


// ── 검토 의견 회신 이력 로드 ──
function loadRevReplyHistory(reviewId) {
  var contentEl = document.getElementById('rev-reply-history-content');
  var wrapEl = document.getElementById('rev-reply-history-wrap');
  if (!contentEl || !wrapEl) return;
  contentEl.innerHTML = '<span style="color:var(--text-muted);">로드 중...</span>';
  google.script.run
    .withSuccessHandler(function(result) {
      if (result && result.ok && result.history) {
        contentEl.innerHTML = renderReplyHistoryCards(result.history);
        wrapEl.style.display = 'block';
      } else if (result && result.ok && !result.history) {
        contentEl.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">아직 회신 이력이 없습니다.</span>';
        wrapEl.style.display = 'block';
      } else {
        wrapEl.style.display = 'none';
      }
    })
    .withFailureHandler(function() {
      wrapEl.style.display = 'none';
    })
    .getReviewReplyHistory(reviewId);
}

function renderReplyHistoryCards(historyText) {
  if (!historyText) return '';
  var entries = historyText.split(/\n\n(?=\[)/);
  if (!entries.length) return '<span style="color:var(--text-muted);font-style:italic;">아직 회신 이력이 없습니다.</span>';
  var legalCount = 0, requestCount = 0;
  return entries.map(function(entry) {
    entry = entry.trim();
    if (!entry) return '';
    var headerMatch = entry.match(/^\[([^\]]+)\]/);
    var header = headerMatch ? headerMatch[1] : '';
    var body = headerMatch ? entry.substring(headerMatch[0].length).trim() : entry;
    body = stripGreetingSignature(body);
    if (!body) body = '(내용 없음)';
    var headerParts = header.split('·').map(function(s){ return s.trim(); });
    var dateStr = headerParts[0] || '';
    var nameStr = headerParts[1] || '';
    var rolePart = headerParts[1] || '';
    var isRequest = rolePart.trim() === '요청';
    var displayName = (headerParts[2] || '').trim();
    var label, badgeBg;
    if (isRequest) {
      requestCount++;
      label = '요청 #' + requestCount;
      badgeBg = 'var(--gold)';
    } else {
      legalCount++;
      label = '법무 #' + legalCount;
      badgeBg = 'var(--ink)';
    }
    return '<div style="background:var(--white);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span style="font-size:0.68rem;font-weight:700;color:var(--white);background:' + badgeBg + ';padding:2px 8px;border-radius:10px;">' + label + '</span>' +
          '<span style="font-size:0.82rem;font-weight:700;color:var(--ink);">' + esc(displayName) + '</span>' +
        '</div>' +
        '<span style="font-size:0.72rem;color:var(--text-muted);">' + esc(dateStr) + '</span>' +
      '</div>' +
      '<div style="font-size:0.84rem;color:var(--text);line-height:1.7;white-space:pre-wrap;">' + esc(body) + '</div>' +
    '</div>';
  }).join('');
}

function stripGreetingSignature(text) {
  if (!text) return '';
  var lines = text.split('\n');
  var filtered = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (/^.{1,20}님,?\s*안녕하세요\.?$/.test(line)) continue;
    if (/^법무실\s+.{1,20}입니다\.?$/.test(line)) continue;
    if (/^감사합니다\.?$/.test(line)) continue;
    if (/^.{1,20}\s*드림\.?$/.test(line)) continue;
    filtered.push(lines[i]);
  }
  return filtered.join('\n').replace(/^\n+/, '').replace(/\n+$/, '').trim();
}

// 모든 .attach-zone에 드래그 앤 드롭 지원
document.addEventListener('dragover', function(e) {
  var zone = e.target.closest('.attach-zone');
  if (zone) { e.preventDefault(); zone.classList.add('drag'); }
});
document.addEventListener('dragleave', function(e) {
  var zone = e.target.closest('.attach-zone');
  if (zone) zone.classList.remove('drag');
});
document.addEventListener('drop', function(e) {
  var zone = e.target.closest('.attach-zone');
  if (!zone) return;
  e.preventDefault();
  zone.classList.remove('drag');
  var input = zone.querySelector('input[type=file]');
  if (!input) return;
  var dt = new DataTransfer();
  Array.from(e.dataTransfer.files).forEach(function(f) { dt.items.add(f); });
  input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
});
// ════════════════════════════════════════════════════════════
//  AI 법무 문구 추천
// ════════════════════════════════════════════════════════════
var COUNTERPARTY_FIELD_CANDIDATES = ['trustee_name','agency_name','client_name','media_name','advertiser_name','buyer_name'];

function getCounterPartyInfo_(){
  if(!currentContract) return { label:'상대방', name:'' };
  var field = currentContract.fields.find(function(f){ return COUNTERPARTY_FIELD_CANDIDATES.indexOf(f.name) >= 0; });
  var label = field ? field.label.replace(/(\s*법인)?명$/, '') : '상대방';
  var name = '';
  if(field){ var el = document.getElementById('f_'+field.name); name = el ? el.value.trim() : ''; }
  return { label: label, name: name };
}

function getFieldLabel_(fieldName){
  if(!currentContract) return fieldName;
  var field = currentContract.fields.find(function(f){ return f.name === fieldName; });
  return field ? field.label : fieldName;
}

var _aiModalState = { fieldName:'' };
window._aiSuggestions = [];

function ensureAiModal_(){
  if(document.getElementById('ai-modal-overlay')) return;
  var html =
    '<div id="ai-modal-overlay" class="ai-modal-overlay" style="display:none;">'+
      '<div class="ai-modal">'+
        '<div class="ai-modal-head">'+
          '<h4 id="ai-modal-title">AI 추천 문구</h4>'+
          '<button type="button" class="ai-modal-close" onclick="closeAiModal()">✕</button>'+
        '</div>'+
        '<div class="ai-modal-body" id="ai-modal-body"></div>'+
        '<div class="ai-modal-foot">'+
          '<button type="button" class="btn btn-ghost" onclick="closeAiModal()">취소</button>'+
          '<button type="button" class="btn btn-ghost" onclick="aiRegenerate()">🔄 다시 생성</button>'+
          '<button type="button" class="btn btn-gold" onclick="applyAiEdit()">적용</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  document.body.insertAdjacentHTML('beforeend', html);
}

function aiAssist(fieldName){ runAiAssist_(fieldName); }
function aiRegenerate(){ runAiAssist_(_aiModalState.fieldName); }

function runAiAssist_(fieldName){
  var el = document.getElementById('f_'+fieldName);
  var userInput = el ? el.value.trim() : '';
  if(!userInput){
    showAlert('상황 설명이나 작성 중인 초안을 먼저 입력해주세요.', {title:'입력 필요', icon:'⚠️'});
    return;
  }
  ensureAiModal_();
  _aiModalState = { fieldName: fieldName };
  document.getElementById('ai-modal-title').textContent = '✨ AI 추천 문구';
  document.getElementById('ai-modal-body').innerHTML = '<div class="ai-modal-loading"><div class="spinner"></div><p>AI가 문구를 검토하고 있습니다...</p></div>';
  document.getElementById('ai-modal-overlay').style.display = 'flex';

  var counter = getCounterPartyInfo_();
  google.script.run
    .withSuccessHandler(function(result){ renderAiResult_(result); })
    .withFailureHandler(function(err){ renderAiError_(err.message || String(err)); })
    .aiAssistText({
      userInput: userInput,
      fieldLabel: getFieldLabel_(fieldName),
      contractName: currentContract ? currentContract.name : '',
      ourParty: currentContract ? currentContract.company : '',
      counterPartyLabel: counter.label,
      counterPartyName: counter.name
    });
}

function renderAiError_(msg){
  document.getElementById('ai-modal-body').innerHTML = '<div class="ai-modal-error">❌ '+esc(msg)+'</div>';
}

function renderAiResult_(result){
  if(!result || !result.ok){ renderAiError_((result&&result.error)||'AI 호출 실패'); return; }
  var html = '';
  if(result.issues && result.issues.length){
    html += '<div class="ai-issue-list">'+result.issues.map(function(i){
      return '<div class="ai-issue"><span class="ai-issue-type">'+esc(i.type)+'</span><div class="ai-issue-body"><s>'+esc(i.original)+'</s> → <b>'+esc(i.fixed)+'</b><div class="ai-issue-reason">'+esc(i.reason)+'</div></div></div>';
    }).join('')+'</div>';
  }
  html += '<div class="ai-card-grid">'+(result.suggestions||[]).map(function(s, idx){
    return '<div class="ai-card" data-idx="'+idx+'" onclick="selectAiCard(this,'+idx+')"><div class="ai-card-text">'+esc(s.text)+'</div><div class="ai-card-note">'+esc(s.note)+'</div></div>';
  }).join('')+'</div>';
  html += '<textarea id="ai-edit-area" class="ai-edit-area" placeholder="카드를 선택하면 여기에 복사됩니다. 자유롭게 수정 후 적용하세요."></textarea>';
  document.getElementById('ai-modal-body').innerHTML = html;
  window._aiSuggestions = result.suggestions || [];
}

function selectAiCard(el, idx){
  document.querySelectorAll('#ai-modal-body .ai-card').forEach(function(c){ c.classList.remove('selected'); });
  el.classList.add('selected');
  var area = document.getElementById('ai-edit-area');
  if(area && window._aiSuggestions[idx]) area.value = window._aiSuggestions[idx].text;
}

function applyAiEdit(){
  var area = document.getElementById('ai-edit-area');
  var text = area ? area.value.trim() : '';
  if(!text){ showAlert('적용할 문구를 카드에서 선택하거나 직접 입력해주세요.', {title:'선택 필요', icon:'⚠️'}); return; }
  var target = document.getElementById('f_'+_aiModalState.fieldName);
  if(target){ target.value = text; onFieldChange(); }
  closeAiModal();
}

function closeAiModal(){
  var overlay = document.getElementById('ai-modal-overlay');
  if(overlay) overlay.style.display = 'none';
}

document.addEventListener('keydown', function(e){
  if(e.key !== 'Escape') return;
  var ov = document.getElementById('ai-modal-overlay');

  if(ov && ov.style.display === 'flex'){ e.stopPropagation(); closeAiModal(); }
}, true);

// ════════════════════════════════════════════════════════════
//  자동작성 폼 보호 (뒤로가기/새로고침 차단 + 복원)
// ════════════════════════════════════════════════════════════
function doShowContractList_() {
  document.getElementById('contract-type-select-view').style.display = 'none';
  document.getElementById('contract-list-view').style.display = 'block';
  document.getElementById('contract-form-view').style.display = 'none';
  document.getElementById('contract-nonstandard-view').style.display = 'none';
  document.getElementById('contract-modified-review-view').style.display = 'none';
  currentContract = null;
  renderContractGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hasFormInput_() {
  if (!currentContract || !currentContract.fields) return false;
  for (var i = 0; i < currentContract.fields.length; i++) {
    var f = currentContract.fields[i];
    if (f.section) continue;
    if (f.type === 'checkbox') {
      if (document.querySelectorAll('input[data-field="' + f.name + '"]:checked').length) return true;
    } else if (f.type === 'radio') {
      if (document.querySelector('input[name="f_' + f.name + '"]:checked')) return true;
    } else {
      var el = document.getElementById('f_' + f.name);
      if (el && el.value.trim() && el.value.trim() !== (f.defaultValue || '').trim()) return true;
    }
  }
  return false;
}

function saveFormToSession_() {
  if (!currentContract) return;
  var data = collectFormData();
  data.__contractId = currentContract.id;
  sessionStorage.setItem('lastContractForm', JSON.stringify(data));
}

function restoreLastForm() {
  var saved = sessionStorage.getItem('lastContractForm');
  if (!saved) { showAlert('복원할 데이터가 없습니다.', { title: '복원 불가', icon: 'ℹ️' }); return; }
  var data = JSON.parse(saved);
  var contract = CONTRACTS.find(function(c) { return c.id === data.__contractId; });
  if (!contract) { showAlert('계약서 유형을 찾을 수 없습니다.', { title: '복원 불가', icon: 'ℹ️' }); return; }

  currentContract = contract;
  renderForm();
  document.getElementById('contract-list-view').style.display = 'none';
  document.getElementById('contract-form-view').style.display = 'block';

  contract.fields.forEach(function(f) {
    if (f.section || !data[f.name]) return;
    if (f.type === 'checkbox') {
      var vals = Array.isArray(data[f.name]) ? data[f.name] : [data[f.name]];
      vals.forEach(function(v) {
        var cb = document.querySelector('input[data-field="' + f.name + '"][value="' + v + '"]');
        if (cb) { cb.checked = true; var item = cb.closest('.checkbox-item'); if (item) item.classList.add('checked'); }
      });
    } else if (f.type === 'radio') {
      var rb = document.querySelector('input[name="f_' + f.name + '"][value="' + data[f.name] + '"]');
      if (rb) rb.checked = true;
    } else {
      var el = document.getElementById('f_' + f.name);
      if (el) el.value = data[f.name];
    }
  });

  toggleLinkedFields();
  onFieldChange();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('beforeunload', function(e) {
  var formView = document.getElementById('contract-form-view');
  if (formView && formView.style.display !== 'none' && currentContract && hasFormInput_()) {
    e.preventDefault();
    e.returnValue = '';
  }
});
