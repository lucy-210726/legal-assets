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
if (e.key !== 'Escape') return;
if (document.getElementById('ref-modal-overlay').style.display === 'flex') { closeRefModal(); return; }
if (document.getElementById('alert-modal-overlay').style.display === 'flex') { closeAlertModal(); return; }
if (document.getElementById('confirm-modal-overlay').style.display === 'flex') { closeConfirmModal(false); return; }
if (document.getElementById('confirm-popup-overlay').style.display === 'flex') { closeConfirmPopup(); return; }
var activePage = document.querySelector('.page.active');
if (!activePage) return;
var pageId = activePage.id.replace('page-','');
if (pageId !== 'home') goBack(pageId);
});

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
showAlert('파일이 드라이브에 저장되었습니다.', {title: '제출이 완료되었습니다!',icon: '✅',onClose: function() {selectedR = null; selectedFile = null;document.getElementById('sel-panel').style.display = 'none';document.getElementById('upload-zone').style.display = 'block';document.getElementById('file-selected').style.display = 'none';document.getElementById('upload-progress').style.display = 'none';document.getElementById('list-search').value = '';refreshContractList();}});
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
var r=_selectedInq;
var isDone=r.status==='답변완료',isProgress=r.status==='진행중';
document.getElementById('inq-detail-title').textContent='['+r.category+'] '+r.title;
var badge=document.getElementById('inq-detail-status-badge');
badge.textContent=isDone?'답변완료':isProgress?'진행중':'미답변';
badge.className='inq-status-badge '+(isDone?'inq-status-done':isProgress?'inq-status-progress':'inq-status-pending');
document.getElementById('inq-detail-meta').innerHTML=[{lbl:'문의자',val:r.name},{lbl:'부서',val:r.dept},{lbl:'접수일',val:fmtDateTimeKo(r.date)}].map(function(f){return '<div class="inq-meta-item"><div class="inq-meta-lbl">'+f.lbl+'</div><div class="inq-meta-val">'+esc(f.val)+'</div></div>';}).join('');
document.getElementById('inq-detail-content').textContent=r.content;
var answerEl=document.getElementById('inq-detail-answer');
if(isDone&&r.answer){var pureText=stripAttachLines(r.answer),attachHtml=renderAttachLinks(r.answer);answerEl.style.display='block';answerEl.innerHTML='<div class="inq-answer-view"><div class="inq-content-label">📨 답변 내용</div><div class="inq-answer-meta">답변일: '+esc(fmtDateTimeKo(r.answerDate||''))+'</div><div class="inq-content-text">'+esc(pureText)+'</div>'+attachHtml+'</div>';} else { answerEl.style.display='none'; answerEl.innerHTML=''; }
var replySection=document.getElementById('inq-reply-section');
var progressSection=document.getElementById('inq-progress-section');
var doneSection=document.getElementById('inq-done-section');
replySection.style.display=progressSection.style.display=doneSection.style.display='none';
_attachFiles['inq']=[]; renderAttachList('inq');
_attachFiles['inq-prog']=[]; renderAttachList('inq-prog');
if(isDone){ doneSection.style.display='block'; }
else if(isProgress){
var assigneeName=r.assignee||'(알 수 없음)';
document.getElementById('inq-progress-info').innerHTML='🔵 <strong>'+esc(assigneeName)+'</strong>님이 진행 중입니다. 답변을 이어서 작성하거나 전송할 수 있습니다.';
document.getElementById('inq-progress-textarea').value='';
progressSection.style.display='block';
populateAssigneeSelect();
} else {
replySection.style.display='block';
document.getElementById('inq-reply-textarea').value='';
if(!document.getElementById('inq-start-btn')){
var footer=replySection.querySelector('.inq-reply-footer .btn-row');
var startBtn=document.createElement('button');
startBtn.id='inq-start-btn'; startBtn.className='btn btn-dark'; startBtn.textContent='진행';
startBtn.onclick=startInquiry;
footer.insertBefore(startBtn, footer.querySelector('#inq-reply-btn'));
}
}
var panel=document.getElementById('inq-detail-panel');
panel.style.display='block';
setTimeout(function(){panel.scrollIntoView({behavior:'smooth',block:'nearest'});},50);
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
var progressCount=rows.filter(function(r){return r.status==='검토중';}).length;
var agreedCount=rows.filter(function(r){return r.status==='합의완료';}).length;
var doneCount=rows.filter(function(r){return r.status==='검토완료';}).length;
var revCountText='전체 '+rows.length+'건 · 검토대기 '+pendingCount+'건';
if(progressCount>0) revCountText+=' · 검토중 '+progressCount+'건';
if(agreedCount>0) revCountText+=' · 합의완료 '+agreedCount+'건';
revCountText+=' · 검토완료 '+doneCount+'건';
document.getElementById('rev-list-count').textContent=revCountText;
if(!rows.length){tbody.innerHTML='<tr><td colspan="8"><div class="list-empty"><div class="empty-icon">📭</div><p>검토 요청 내역이 없습니다.</p></div></td></tr>';return;}
tbody.innerHTML=rows.map(function(r){
var isDone=r.status==='검토완료', isProgress=r.status==='검토중', isAgreed=r.status==='합의완료';
var isSelected=_selectedRev&&_selectedRev.id===r.id;
var revBadgeClass=isDone?'rev-status-done':isProgress?'rev-status-inprogress':isAgreed?'rev-status-agreed':'rev-status-pending';
var progressName=r.confirmedBy||'';
var partyLabel = r.contractParty || '\u2014';
var partyBadge = '<td style="text-align:center;"><span class="party-badge ' + partyClass(partyLabel) + '">' + esc(partyLabel) + '</span></td>';
var revTypeLabel = r.contractType === 'nonstandard' ? '비표준' : '표준';
var revTypeBadge = '<td style="text-align:center;"><span style="padding:2px 8px;border-radius:10px;font-weight:700;font-size:0.68rem;' + (r.contractType==='nonstandard' ? 'background:#fef3e8;color:#c0622b;' : 'background:#e8f0fb;color:#2c5fad;') + '">' + revTypeLabel + '</span></td>';
return '<tr data-id="'+esc(r.id)+'" onclick="selectRev(\''+esc(r.id)+'\')" class="'+(isSelected?'selected':'')+'"><td class="col-radio"><input type="radio" class="row-radio" name="rev-row" '+(isSelected?'checked':'')+' onclick="event.stopPropagation();selectRev(\''+esc(r.id)+'\')"></td><td class="col-rev-requester" style="font-weight:600;text-align:center;">'+esc(r.requesterName)+'</td>'+partyBadge+revTypeBadge+'<td class="col-rev-name" style="font-weight:500;">'+esc(r.contractName)+'</td><td class="col-rev-date hide-mobile" style="font-size:0.8rem;color:var(--text-muted);text-align:center;">'+esc(fmtDateTimeKo(r.requestDate))+'</td><td class="col-rev-status" style="text-align:center;"><span class="rev-status-badge '+revBadgeClass+'">'+esc(r.status||'검토대기')+'</span></td><td class="col-rev-confirmed hide-mobile" style="font-size:0.82rem;color:var(--text-muted);text-align:center;">'+esc(progressName)+'</td></tr>';
}).join('');
}
function selectRev(id){var pool=_revFiltered.length?_revFiltered:_revAll;_selectedRev=pool.find(function(r){return r.id===id;})||null;renderRevTable(pool); if(_selectedRev) renderRevDetailPanel();}
function clearRevSel(){_selectedRev=null;renderRevTable(_revFiltered.length?_revFiltered:_revAll);document.getElementById('rev-detail-panel').style.display='none';document.getElementById('rev-assignee-wrap-dynamic').innerHTML='';}
function renderRevDetailPanel(){
var r=_selectedRev;
var isDone=r.status==='검토완료', isProgress=r.status==='검토중', isAgreed=r.status==='합의완료';
var isPending=!r.status||r.status==='검토대기';
var isLegal=IS_LEGAL_TEAM==='true';
document.getElementById('rev-detail-title').textContent=r.contractName;
var badge=document.getElementById('rev-detail-status-badge');
badge.textContent=r.status||'검토대기';
badge.className='rev-status-badge '+(isDone?'rev-status-done':isProgress?'rev-status-inprogress':isAgreed?'rev-status-agreed':'rev-status-pending');
document.getElementById('rev-detail-meta').innerHTML=[{lbl:'요청자',val:r.requesterName},{lbl:'요청일',val:fmtDateTimeKo(r.requestDate)},{lbl:'요청 이메일',val:r.requesterEmail}].map(function(f){return '<div class="rev-meta-item"><div class="rev-meta-lbl">'+f.lbl+'</div><div class="rev-meta-val">'+esc(f.val)+'</div></div>';}).join('');
var opinionWrap=document.getElementById('rev-opinion-wrap');
if(r.opinion){opinionWrap.style.display='block';document.getElementById('rev-detail-opinion').textContent=r.opinion;}else{opinionWrap.style.display='none';}
var fileWrap=document.getElementById('rev-file-wrap');
if(r.fileUrl){fileWrap.style.display='block';document.getElementById('rev-file-link').href=r.fileUrl;}else{fileWrap.style.display='none';}
var confirmedWrap=document.getElementById('rev-confirmed-wrap');
if(isDone){confirmedWrap.style.display='block';document.getElementById('rev-confirmed-text').textContent='\u2705 검토완료 · '+(fmtDateTimeKo(r.confirmedAt)||'')+' · 진행자: '+(r.confirmedBy||'');} else { confirmedWrap.style.display='none'; }
var dynWrap=document.getElementById('rev-assignee-wrap-dynamic');
if(isProgress && isLegal){
dynWrap.innerHTML='<div style="padding:0 28px 16px;"><div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--surface);border:1px solid var(--border);border-radius:10px;"><span style="font-family:var(--font);font-size:0.82rem;font-weight:600;color:var(--ink-3);white-space:nowrap;">👤 진행자 변경</span><select id="rev-assignee-select" style="flex:1;font-family:var(--font);font-size:0.85rem;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;background:var(--white);color:var(--text);"><option value="">진행자 선택...</option></select><button onclick="doChangeRevAssignee()" style="font-family:var(--font);font-size:0.8rem;font-weight:600;padding:8px 16px;border-radius:8px;border:1.5px solid var(--gold);background:transparent;color:var(--gold);cursor:pointer;white-space:nowrap;">변경</button></div></div>';
populateRevAssigneeSelect();
} else {dynWrap.innerHTML='';}
var foot=document.getElementById('rev-detail-foot');
var confirmBtn=document.getElementById('rev-confirm-btn');
['rev-start-btn','rev-agree-btn'].forEach(function(bid){ var b=document.getElementById(bid); if(b) b.remove(); });
if(isPending && isLegal){var startBtn=document.createElement('button');startBtn.id='rev-start-btn'; startBtn.className='btn btn-dark'; startBtn.textContent='\u25b6 검토 시작';startBtn.onclick=doStartReview;foot.insertBefore(startBtn, confirmBtn);confirmBtn.style.display='none';}
else if(isProgress && !isLegal && r.requesterEmail===USER_EMAIL){var agreeBtn=document.createElement('button');agreeBtn.id='rev-agree-btn'; agreeBtn.className='btn btn-gold'; agreeBtn.textContent='\u2705 합의 완료';agreeBtn.onclick=doAgreeReview;foot.insertBefore(agreeBtn, confirmBtn);confirmBtn.style.display='none';}
else if(isAgreed && isLegal){confirmBtn.style.display='inline-block'; confirmBtn.disabled=false; confirmBtn.textContent='\u2705 검토 확인 완료';}
else {confirmBtn.style.display='none';}
var panel=document.getElementById('rev-detail-panel');panel.style.display='block';setTimeout(function(){panel.scrollIntoView({behavior:'smooth',block:'nearest'});},50);
}
function populateRevAssigneeSelect(){loadLegalMembers(function(members){var sel=document.getElementById('rev-assignee-select');if(!sel) return;var current=_selectedRev?(_selectedRev.confirmedBy||''):'';sel.innerHTML='<option value="">진행자 선택...</option>'+members.map(function(m){return '<option value="'+esc(m.email)+'" '+(m.email===current?'selected':'')+'>'+esc(m.name)+'</option>';}).join('');});}
function doChangeRevAssignee(){if(!_selectedRev) return;var sel=document.getElementById('rev-assignee-select');var email=sel?sel.value:'';if(!email){showAlert('진행자를 선택해주세요.',{title:'선택 필요',icon:'⚠️'});return;}google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var selectedOption=sel?sel.options[sel.selectedIndex]:null;var assigneeName=selectedOption?selectedOption.text:email.split('@')[0];var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.confirmedBy=assigneeName;_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll);renderRevDetailPanel();}else{showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'변경 실패',icon:'❌'});}}).withFailureHandler(function(err){showAlert(err.message||String(err),{title:'오류',icon:'❌'});}).changeReviewAssignee(_selectedRev.id,email);}
function doStartReview(){if(!_selectedRev) return;var btn=document.getElementById('rev-start-btn');if(btn){btn.disabled=true;btn.textContent='처리 중...';}google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.status='검토중';_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll);renderRevDetailPanel();}else{showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'처리 실패',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='\u25b6 검토 시작';}}}).withFailureHandler(function(err){showAlert(err.message||String(err),{title:'오류',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='\u25b6 검토 시작';}}).startReview(_selectedRev.id);}
function doAgreeReview(){if(!_selectedRev) return;showConfirm('합의 완료 처리하시겠습니까?\n법무실에 합의 완료 사실이 전달됩니다.',{title:_selectedRev.contractName, icon:'\u2705', okLabel:'합의 완료',onOk:function(){var btn=document.getElementById('rev-agree-btn');if(btn){btn.disabled=true;btn.textContent='처리 중...';}google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.status='합의완료';_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll);renderRevDetailPanel();}else{showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'처리 실패',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='\u2705 합의 완료';}}}).withFailureHandler(function(err){showAlert(err.message||String(err),{title:'오류',icon:'❌'});if(btn){btn.disabled=false;btn.textContent='\u2705 합의 완료';}}).agreeReview(_selectedRev.id);}});}
function doConfirmReview(){if(!_selectedRev) return;if(_selectedRev.status!=='합의완료'){showAlert('합의완료 상태에서만 검토 확인이 가능합니다.',{title:'처리 불가',icon:'⚠️'});return;}showConfirm('이 검토 요청을 검토완료 처리하시겠습니까?',{title:_selectedRev.contractName, icon:'\u2705', okLabel:'검토완료 처리',onOk:function(){var btn=document.getElementById('rev-confirm-btn');btn.disabled=true; btn.textContent='처리 중...';google.script.run.withSuccessHandler(function(result){if(result&&result.ok){var row=_revAll.find(function(r){return r.id===_selectedRev.id;});if(row){row.status='검토완료';row.confirmedAt=fmtDateTimeKo(new Date());row.confirmedBy=row.confirmedBy||USER_EMAIL;_selectedRev=row;}renderRevTable(_revFiltered.length?_revFiltered:_revAll); renderRevDetailPanel();} else { showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'처리 실패',icon:'❌'}); btn.disabled=false; btn.textContent='\u2705 검토 확인 완료'; }}).withFailureHandler(function(err){ showAlert(err.message||String(err),{title:'오류',icon:'❌'}); btn.disabled=false; btn.textContent='\u2705 검토 확인 완료'; }).confirmReview(_selectedRev.id);}});}

// ════════════════════════════════════════════════════════════
//  내 문의 현황
// ════════════════════════════════════════════════════════════
function loadMyInquiries(){
var container=document.getElementById('myinquiry-list');
container.innerHTML='<div class="inq-empty"><div class="empty-icon">⏳</div><p>로드 중...</p></div>';
google.script.run.withSuccessHandler(function(rows){
if(!rows||!rows.length){container.innerHTML='<div class="inq-empty"><div class="empty-icon">📭</div><p>접수된 문의가 없습니다.</p></div>';return;}
container.innerHTML=rows.map(function(r){return '<div class="inq-card"><div class="inq-card-head"><div><div class="inq-card-title">['+esc(r.category)+'] '+esc(r.title)+'</div><div class="inq-card-meta">'+esc(fmtDateTimeKo(r.date))+'</div></div><span class="inq-status-badge '+(r.status==='답변완료'?'inq-status-done':'inq-status-pending')+'">'+esc(r.status||'미답변')+'</span></div><div class="inq-card-content">'+esc(r.content)+'</div>'+(r.answer?'<div class="inq-answer-box-my"><div class="inq-answer-label">📨 법무실 답변 · '+esc(fmtDateTimeKo(r.answerDate||''))+'</div><div class="inq-answer-text">'+esc(stripAttachLines(r.answer))+'</div>'+renderAttachLinks(r.answer)+'</div>':'<div style="font-family:var(--font);font-size:0.82rem;color:var(--text-muted);margin-top:8px;">⏳ 답변 대기 중 · 확인 후 순차적으로 Slack 또는 메일로 답변드리겠습니다.</div>')+'</div>';}).join('');
}).withFailureHandler(function(err){ container.innerHTML='<div class="inq-empty"><div class="empty-icon">⚠️</div><p>로드 실패: '+esc(err.message||String(err))+'</p></div>'; }).getMyInquiries(USER_EMAIL, USER_NAME);
}
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
}
if(p==='home'){
var homeEl = document.getElementById('page-home');
if(homeEl) homeEl.scrollTop = 0;
loadDashboard();
}
if(p==='myinquiry')  loadMyInquiries();
if(p==='inqmgmt')    loadInqMgmt();
if(p==='reviewmgmt') loadReviewMgmt();
}
function goBack(p){
if(p==='contract'){var formView=document.getElementById('contract-form-view');var listView=document.getElementById('contract-list-view');var nsView=document.getElementById('contract-nonstandard-view');if(formView&&formView.style.display!=='none'){ showContractList(); return; }if(listView&&listView.style.display!=='none'){ showContractTypeSelect(); return; }if(nsView&&nsView.style.display!=='none'){ showContractTypeSelect(); return; }}
showPage('home');
}

function filterCompany(company,e){ currentCompany=company; document.querySelectorAll('.company-tab').forEach(function(t){t.classList.remove('active');}); if(e&&e.target) e.target.classList.add('active'); renderContractGrid(); }
function renderContractGrid(){document.getElementById('contract-grid').innerHTML=CONTRACTS.filter(function(c){return c.company===currentCompany;}).map(function(c){var btns = '';if (c.templateId || c.downloadId) {btns = '<div class="card-btns" style="gap:8px;margin-top:14px;">';if (c.templateId) btns += '<button class="btn-sm" onclick="event.stopPropagation();previewTemplate(\''+c.templateId+'\',\''+esc(c.name)+'\')">양식 미리보기</button>';
if (c.downloadId) btns += '<button class="btn-sm" onclick="event.stopPropagation();downloadTemplate(\''+c.downloadId+'\',\''+esc(c.name)+'\')">양식 다운로드</button>';btns += '</div>';}return '<div class="contract-type-card" onclick="selectContractType(\''+c.id+'\')"><span class="tag '+c.company.toLowerCase()+'">'+c.company+'</span><h4>'+c.name+'</h4><p>'+c.desc+'</p>'+btns+'</div>';}).join('');}
function previewTemplate(templateId, name) {
document.getElementById('ref-modal-title').textContent = name + ' 미리보기';
document.getElementById('ref-modal-tabs').style.display = 'none';
document.getElementById('ref-modal-iframe').src = 'https://docs.google.com/document/d/' + templateId + '/preview';
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
function showContractList(){document.getElementById('contract-type-select-view').style.display='none';document.getElementById('contract-list-view').style.display='block';document.getElementById('contract-form-view').style.display='none';document.getElementById('contract-nonstandard-view').style.display='none';currentContract=null;renderContractGrid();}
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

function selectContractType(id){ currentContract=CONTRACTS.find(function(c){return c.id===id;}); renderForm(); document.getElementById('contract-list-view').style.display='none'; document.getElementById('contract-form-view').style.display='block'; window.scrollTo({top:0,behavior:'smooth'}); }
function renderForm(){
var c=currentContract; var html='', grid=[];
var flush=function(){ if(grid.length){html+='<div class="form-grid">'+grid.join('')+'</div>';grid=[];} };
c.fields.forEach(function(f){ if(f.section){flush();html+='<div class="field-section-title">'+f.section+'</div>';return;} grid.push(renderField(f)); });flush();
document.getElementById('contract-form-container').innerHTML='<div class="form-container"><div class="form-header"><div class="form-header-left"><div class="form-tag">'+c.company+' \u00b7 Standard Contract</div><h3>'+c.name+'</h3></div><div class="form-header-right">필수 항목<br><strong>'+c.fields.filter(function(f){return f.required;}).length+'개</strong></div></div><div class="form-body">'+html+'</div><div class="review-section"><label class="review-toggle"><input type="checkbox" id="review-check" onchange="toggleReviewFields()"><div><div class="review-toggle-label">\u2696\ufe0f 법무실 검토 요청</div><div class="review-toggle-sub">체크 시 생성된 계약서와 검토 의견이 법무실 이메일로 전송됩니다</div></div></label><div class="review-fields" id="review-fields" style="display:none;"><div class="form-group"><label>검토 요청 의견</label><textarea id="review-opinion" placeholder="검토가 필요한 부분이나 특이사항을 작성해 주세요." oninput="onFieldChange()"></textarea></div><div class="form-group"><label>추가 수신자 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="recipient-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete(\'recipient-input\',\'to-ac\')" onkeydown="handleAcKeydown(event,\'recipient-input\',\'to-ac\',\'to\')"><div class="autocomplete-list" id="to-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addRecipient(\'to\')">+ 수신</button></div><div class="recipient-tags" id="to-tags"></div></div><div class="form-group"><label>참조(CC) 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="cc-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete(\'cc-input\',\'cc-ac\')" onkeydown="handleAcKeydown(event,\'cc-input\',\'cc-ac\',\'cc\')"><div class="autocomplete-list" id="cc-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addRecipient(\'cc\')">+ 참조</button></div><div class="recipient-tags" id="cc-tags"></div></div></div></div><div class="form-footer"><div class="form-footer-note"><strong>*</strong> 필수 항목</div><div class="btn-row"><button class="btn btn-ghost" onclick="showContractList()">취소</button><button class="btn btn-ghost" id="preview-btn" onclick="previewCurrentContract()" disabled>미리보기</button><button class="btn btn-gold" id="gen-btn" onclick="generateContract()" disabled>작성 완료</button></div></div></div>';
window._reviewToList=[]; window._reviewCcList=[];
}
function renderField(f){var sc=f.span===2?' span-2':'', req=f.required?'<span class="req">*</span>':'', hint=f.hint?'<div class="hint">'+f.hint+'</div>':'';var inp='';if(f.type==='textarea') inp='<textarea id="f_'+f.name+'" placeholder="'+f.label+'" oninput="onFieldChange()"></textarea>';else if(f.type==='checkbox') inp='<div class="checkbox-list">'+f.options.map(function(o){return '<label class="checkbox-item"><input type="checkbox" value="'+o+'" data-field="'+f.name+'" onchange="this.closest(\'.checkbox-item\').classList.toggle(\'checked\',this.checked);onFieldChange()"><span>'+o+'</span></label>';}).join('')+'</div>';else if(f.type==='radio') inp='<div class="radio-row">'+f.options.map(function(o){return '<label class="radio-item"><input type="radio" name="f_'+f.name+'" value="'+o+'" onchange="onFieldChange()"><span>'+o+'</span></label>';}).join('')+'</div>';else {var isEndDate=f.name.endsWith('_end')||f.name==='end_date', isStartDate=f.name.endsWith('_start')||f.name==='start_date';var extraAttr='';if(isStartDate){var endFieldName=f.name.replace('_start','_end').replace('start_date','end_date');extraAttr=' onchange="onFieldChange();updateEndDateMin(\'f_'+f.name+'\',\'f_'+endFieldName+'\')"';}if(isEndDate) extraAttr=' oninput="onFieldChange()"';inp='<input type="'+f.type+'" id="f_'+f.name+'" placeholder="'+f.label+'"'+(isEndDate||isStartDate?'':' oninput="onFieldChange()"')+extraAttr+'>';}return '<div class="form-group'+sc+'"><label>'+f.label+' '+req+'</label>'+inp+hint+'</div>';}
function toggleReviewFields(){ var checked=document.getElementById('review-check');checked=checked?checked.checked:false; var fields=document.getElementById('review-fields'); if(fields) fields.style.display=checked?'flex':'none'; }
function addRecipient(type){var inputId=type==='to'?'recipient-input':'cc-input', tagsId=type==='to'?'to-tags':'cc-tags', listKey=type==='to'?'_reviewToList':'_reviewCcList';var input=document.getElementById(inputId); if(!input) return;var email=input.value.trim().toLowerCase();if(!email||!email.includes('@')){ input.style.borderColor='var(--red)'; setTimeout(function(){input.style.borderColor='';},1200); showAlert('올바른 이메일 주소를 입력해주세요.',{title:'이메일 형식 오류',icon:'⚠️'}); return; }if(window[listKey].includes(email)){input.value='';return;}window[listKey].push(email); input.value=''; renderRecipientTags(tagsId,listKey);}
function removeRecipient(type,email){ var listKey=type==='to'?'_reviewToList':'_reviewCcList', tagsId=type==='to'?'to-tags':'cc-tags'; window[listKey]=window[listKey].filter(function(e){return e!==email;}); renderRecipientTags(tagsId,listKey); }
function renderRecipientTags(tagsId,listKey){ var container=document.getElementById(tagsId); if(!container) return; container.innerHTML=(window[listKey]||[]).map(function(email){return '<span class="recipient-tag">'+esc(email)+'<button onclick="removeRecipient(\''+(tagsId.includes('to')?'to':'cc')+'\',\''+esc(email)+'\')" title="제거">✕</button></span>';}).join(''); }
function updateEndDateMin(startId,endId){ var startEl=document.getElementById(startId),endEl=document.getElementById(endId); if(!startEl||!endEl) return; var startVal=startEl.value; if(!startVal) return; endEl.min=startVal; if(endEl.value&&endEl.value<startVal){endEl.value='';onFieldChange();} }
function onFieldChange(){ var v=validateCurrentForm(); var b=document.getElementById('gen-btn'); if(b) b.disabled=!v; var p=document.getElementById('preview-btn'); if(p) p.disabled=!v; }
function validateCurrentForm(){if(!currentContract) return false;for(var i=0;i<currentContract.fields.length;i++){var f=currentContract.fields[i];if(!f.required||f.section) continue;if(f.type==='checkbox'){if(!document.querySelectorAll('input[data-field="'+f.name+'"]:checked').length) return false;}else if(f.type==='radio'){if(!document.querySelector('input[name="f_'+f.name+'"]:checked')) return false;}else{var el=document.getElementById('f_'+f.name);if(!el||!el.value.trim()) return false;}}return true;}
function collectFormData(){var d={};currentContract.fields.forEach(function(f){if(f.section) return;if(f.type==='checkbox') d[f.name]=Array.from(document.querySelectorAll('input[data-field="'+f.name+'"]:checked')).map(function(c){return c.value;});else if(f.type==='radio'){var el=document.querySelector('input[name="f_'+f.name+'"]:checked');d[f.name]=el?el.value:'';}else{var el=document.getElementById('f_'+f.name);d[f.name]=el?el.value:'';}});return d;}
async function generateContract(){if(!validateCurrentForm()) return;var container=document.getElementById('contract-form-container');var raw=collectFormData();var toKo=function(d){if(!d) return '';var p=d.split('-');return p.length===3?p[0]+'\ub144 '+p[1]+'\uc6d4 '+p[2]+'\uc77c':d;};var fmtN=function(n){var s=String(n).replace(/[^0-9]/g,'');return s?Number(s).toLocaleString('ko-KR'):'';};var dateF=['contract_date','service_start','service_end','ad_start','ad_end','media_start','media_end','reward_start','reward_end','original_contract_date','SIGN_DATE'];var numF=['service_cost','total_amount','monthly_fee','contract_amount','ad_budget','cpa_rate'];var payload={contractType:currentContract.id,contractName:currentContract.name};Object.keys(raw).forEach(function(k){if(dateF.includes(k)) payload[k]=toKo(raw[k]);else if(numF.includes(k)) payload[k]=fmtN(raw[k]);else payload[k]=Array.isArray(raw[k])?raw[k].join(', '):raw[k];});payload.remarks=(payload.remarks&&payload.remarks.trim())||'\uc5c6\uc74c';payload.invoice_date=payload.invoice_date||'\uc6a9\uc5ed \uc644\ub8cc \uc6d4\uc758 \ub9d0\uc77c';payload.payment_date=payload.payment_date||'\uc138\uae08\uacc4\uc0b0\uc11c \ubc1c\ud589\uc77c \uae30\uc900 \uc775\uc6d4 \ub9d0\uc77c \uc774\ub0b4';payload.userId=SLACK_USER_ID; payload.userEmail=USER_EMAIL||'';var reviewCheck=document.getElementById('review-check');payload.isReviewRequested=reviewCheck?reviewCheck.checked===true:false;payload.reviewOpinion=(document.getElementById('review-opinion')?document.getElementById('review-opinion').value.trim():'')||'';payload.reviewToList=JSON.stringify(window._reviewToList||[]);payload.reviewCcList=JSON.stringify(window._reviewCcList||[]);container.innerHTML='<div class="state-panel"><div class="spinner"></div><h3>계약서를 생성하고 있습니다...</h3><p>잠시만 기다려주세요.</p></div>';try{var genResult=await new Promise(function(resolve,reject){google.script.run.withSuccessHandler(resolve).withFailureHandler(function(err){reject(new Error(err.message||'계약서 생성 실패'));}).handleGenerateContract(JSON.stringify(payload));});window._generatedFileId=genResult&&genResult.fileId?genResult.fileId:'';window._generatedFileName=genResult&&genResult.fileName?genResult.fileName:payload.contractName+'.docx';container.innerHTML='<div class="state-panel"><div class="success-panel"><div class="success-badge">\u2705</div><h3>계약서 생성 완료!</h3><p style="margin:12px 0 20px;">아래 버튼으로 파일을 다운로드하거나 Slack/이메일로 전송하세요.</p><div style="display:flex;flex-direction:column;gap:10px;align-items:center;max-width:360px;margin:0 auto 24px;"><button class="btn btn-gold" onclick="downloadGeneratedContract()" style="width:100%;">\u2b07 계약서 다운로드 (.docx)</button><button class="btn btn-ghost" onclick="sendGeneratedContract(\'slack\')" style="width:100%;">💬 Slack DM으로 전송</button><button class="btn btn-ghost" onclick="sendGeneratedContract(\'email\')" style="width:100%;">📧 이메일로 전송</button></div><div style="display:flex;gap:12px;justify-content:center;"><button class="btn btn-ghost" onclick="showPage(\'home\')">홈으로</button><button class="btn btn-dark" onclick="showContractList()">다른 계약서 작성</button></div></div></div>';}catch(e){ container.innerHTML='<div class="state-panel"><h3>\u26a0\ufe0f 오류</h3><p>'+e.message+'</p><button class="btn btn-ghost" onclick="showContractList()">돌아가기</button></div>'; }}
function selectCategory(el,cat){ document.querySelectorAll('.category-card').forEach(function(c){c.classList.remove('selected');}); el.classList.add('selected'); selectedInqCategory=cat; checkInquiryReady(); }
function checkInquiryReady(){ var ok=document.getElementById('inq-name')&&document.getElementById('inq-name').value.trim()&&document.getElementById('inq-dept')&&document.getElementById('inq-dept').value.trim()&&selectedInqCategory&&document.getElementById('inq-title')&&document.getElementById('inq-title').value.trim()&&document.getElementById('inq-content')&&document.getElementById('inq-content').value.trim(); var b=document.getElementById('inquiry-btn'); if(b) b.disabled=!ok; }
async function submitInquiry(){var name=document.getElementById('inq-name')?document.getElementById('inq-name').value.trim():'', dept=document.getElementById('inq-dept')?document.getElementById('inq-dept').value.trim():'', title=document.getElementById('inq-title')?document.getElementById('inq-title').value.trim():'', content=document.getElementById('inq-content')?document.getElementById('inq-content').value.trim():'', category=selectedInqCategory||'', userEmail=USER_EMAIL||'', userSlackId=SLACK_USER_ID?SLACK_USER_ID:''; var m=document.getElementById('inquiry-main');var inqBtn=document.getElementById('inquiry-btn');if(inqBtn){inqBtn.disabled=true;inqBtn.textContent='전송 중...';}try{var attachText='';if(_attachFiles['inq-form'].length>0){var attachInfos=await uploadAttachmentsToDrive('inq-form');if(attachInfos.length>0) attachText=buildAttachText(attachInfos);_attachFiles['inq-form']=[]; renderAttachList('inq-form');}var finalContent=content+(attachText?'\n\n'+attachText:'');await new Promise(function(resolve,reject){ google.script.run.withSuccessHandler(resolve).withFailureHandler(function(err){reject(new Error(err.message||'문의 전송 실패'));}).handleSubmitInquiry(name,dept,category,title,finalContent,userEmail,userSlackId); });showAlert('문의사항이 법무실로 전송되었습니다.\n확인 후 순차적으로 Slack 또는 메일로 답변드리겠습니다.', {title: '문의가 접수되었습니다!',icon: '\u2705',onClose: function() {if(inqBtn){inqBtn.disabled=true;inqBtn.textContent='문의 전송';}showPage('inquiry');}});}catch(e){ m.innerHTML='<div class="state-panel"><h3>\u26a0\ufe0f 오류</h3><p>'+e.message+'</p></div>'; }}
function downloadGeneratedContract(){var fileId=window._generatedFileId, fileName=window._generatedFileName||'계약서.docx';if(!fileId){ showAlert('파일 정보가 없습니다. 다시 시도해주세요.',{title:'파일 없음',icon:'⚠️'}); return; }var btn=event.target; btn.disabled=true; btn.textContent='다운로드 중...';google.script.run.withSuccessHandler(function(result){btn.disabled=false; btn.textContent='\u2b07 계약서 다운로드 (.docx)';if(!result||!result.ok){ showAlert(result&&result.error?result.error:'알 수 없는 오류가 발생했습니다.',{title:'다운로드 실패',icon:'❌'}); return; }var byteChars=atob(result.base64), byteArr=new Uint8Array(byteChars.length);for(var i=0;i<byteChars.length;i++) byteArr[i]=byteChars.charCodeAt(i);var blob=new Blob([byteArr],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});var url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url; a.download=fileName; a.click(); URL.revokeObjectURL(url);}).withFailureHandler(function(err){ btn.disabled=false; btn.textContent='\u2b07 계약서 다운로드 (.docx)'; showAlert(err.message||String(err),{title:'다운로드 오류',icon:'❌'}); }).getContractFileBase64(fileId);}
async function sendGeneratedContract(method){var fileId=window._generatedFileId, fileName=window._generatedFileName||'계약서.docx';if(!fileId){ showAlert('파일 정보가 없습니다. 다시 시도해주세요.',{title:'파일 없음',icon:'⚠️'}); return; }var btn=event.target; btn.disabled=true; btn.textContent='전송 중...';var freshToken=await new Promise(function(resolve){ google.script.run.withSuccessHandler(resolve).withFailureHandler(function(){resolve(OAUTH_TOKEN);}).getFreshToken(); });var userId=SLACK_USER_ID?SLACK_USER_ID:'';google.script.run.withSuccessHandler(function(result){if(result&&result.ok){ btn.disabled=true; btn.textContent=method==='slack'?'\u2705 Slack 전송 완료':'\u2705 이메일 전송 완료'; }else{ btn.disabled=false; btn.textContent=method==='slack'?'💬 Slack DM으로 전송':'📧 이메일로 전송'; showAlert((result&&result.error)||'알 수 없는 오류가 발생했습니다.',{title:'전송 실패',icon:'❌'}); }}).withFailureHandler(function(err){ btn.disabled=false; btn.textContent=method==='slack'?'💬 Slack DM으로 전송':'📧 이메일로 전송'; showAlert(err.message||String(err),{title:'전송 오류',icon:'❌'}); }).sendContractFile(fileId,fileName,method,userId,USER_EMAIL);}

// ════════════════════════════════════════════════════════════
//  멤버/법무팀 목록
// ════════════════════════════════════════════════════════════
var _memberList=null;
function loadMemberList(cb){ if(_memberList!==null){if(cb) cb(_memberList);return;} google.script.run.withSuccessHandler(function(rows){_memberList=rows||[];if(cb) cb(_memberList);}).withFailureHandler(function(){_memberList=[];if(cb) cb([]);}).getMemberList(); }
var _legalMembers=null;
function loadLegalMembers(cb){if(_legalMembers!==null){if(cb) cb(_legalMembers);return;}google.script.run.withSuccessHandler(function(rows){ _legalMembers=rows||[]; if(cb) cb(_legalMembers); }).withFailureHandler(function(){ _legalMembers=[]; if(cb) cb([]); }).getLegalMembers();}
function populateAssigneeSelect(){loadLegalMembers(function(members){var sel=document.getElementById('inq-assignee-select');if(!sel) return;var current=_selectedInq?(_selectedInq.assignee||''):'';sel.innerHTML='<option value="">담당자 선택...</option>'+members.map(function(m){return '<option value="'+esc(m.email)+'" '+(m.email===current?'selected':'')+'>'+esc(m.name)+'</option>';}).join('');});}
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
function showContractTypeSelect(){document.getElementById('contract-type-select-view').style.display='block';document.getElementById('contract-list-view').style.display='none';document.getElementById('contract-form-view').style.display='none';document.getElementById('contract-nonstandard-view').style.display='none';}
function handleDeepLink() {if (INIT_PAGE === 'submit') {showPage('submit');}}
function autoSelectSubmitRowFromUrl() {if (!INIT_ROWNUM) return;var num = Number(INIT_ROWNUM);if (!num) return;var exists = allRows.find(function(r) { return r.rowNum === num; });if (exists) {selectRow(num);}INIT_ROWNUM = '';}

// ════════════════════════════════════════════════════════════
//  참고 자료 PDF 뷰어
// ════════════════════════════════════════════════════════════
var REF_FILES = {
'approval_igaw': '1TtRUJRCE9mpz7q40WZT35jI8tr2sI-qG',
'approval_adp':  '1_aIEtHc73BzSY4-664pYcDDJMa5WMhZV',
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
document.getElementById('ref-modal-overlay').style.display = 'flex';
}
function switchRefTab(key, btn) {var tabs = document.getElementById('ref-modal-tabs');tabs.querySelectorAll('.company-tab').forEach(function(t){ t.classList.remove('active'); });btn.classList.add('active');loadRefPdf(key);}
function loadRefPdf(key) {var fileId = REF_FILES[key];if (!fileId) return;document.getElementById('ref-modal-iframe').src = 'https://drive.google.com/file/d/' + fileId + '/preview';}
function closeRefModal() {document.getElementById('ref-modal-overlay').style.display = 'none';document.getElementById('ref-modal-iframe').src = '';}
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
function renderDashboard(inquiries, reviews) {
document.getElementById('sc-inq-pending').textContent  = inquiries.filter(function(r){return r.status==='\ubbf8\ub2f5\ubcc0' && !r.assignee;}).length;
document.getElementById('sc-inq-progress').textContent = inquiries.filter(function(r){return r.status==='\ubbf8\ub2f5\ubcc0' && r.assignee;}).length;
document.getElementById('sc-rev-pending').textContent  = reviews.filter(function(r){return !r.status||r.status==='\uac80\ud1a0\ub300\uae30';}).length;
document.getElementById('sc-rev-progress').textContent = reviews.filter(function(r){return r.status==='\uac80\ud1a0\uc911';}).length;
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
var bc = r.status==='\uac80\ud1a0\uc911' ? 'rev-status-inprogress' : r.status==='\ud569\uc758\uc644\ub8cc' ? 'rev-status-agreed' : 'rev-status-pending';
var revTypeLabel = r.contractType === 'nonstandard' ? '\ube44\ud45c\uc900' : '\ud45c\uc900';
var partyLabel = r.contractParty || '\u2014';
return '<tr><td style="font-weight:600;text-align:center;">' + esc(r.requesterName) + '</td>' +
'<td style="font-size:0.78rem;text-align:center;white-space:nowrap;"><span class="party-badge ' + partyClass(partyLabel) + '">' + esc(partyLabel) + '</span></td>' +
'<td style="font-size:0.78rem;text-align:center;white-space:nowrap;"><span style="padding:2px 8px;border-radius:10px;font-weight:700;font-size:0.68rem;' + (r.contractType==='nonstandard' ? 'background:#fef3e8;color:#c0622b;' : 'background:#e8f0fb;color:#2c5fad;') + '">' + revTypeLabel + '</span></td>' +
'<td class="col-name">' + esc(r.contractName) + '</td>' +
'<td class="hide-mobile" style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap;text-align:center;">' + fmtDateShort(r.requestDate) + '</td>' +
'<td style="text-align:center;"><span class="rev-status-badge ' + bc + '">' + esc(r.status||'\uac80\ud1a0\ub300\uae30') + '</span></td>' +
'<td class="hide-mobile" style="font-size:0.8rem;color:var(--text-muted);text-align:center;">' + esc(r.confirmedBy||'\u2014') + '</td></tr>';
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
document.getElementById('modals-container').innerHTML = PAGE_TEMPLATES.modals;
Array.from(document.body.childNodes).forEach(function(n){
if(n.nodeType===3 && n.textContent.trim()) n.remove();
});
document.getElementById('today-date').textContent = new Date().toLocaleDateString('ko-KR', { year:'numeric', month:'long', day:'numeric' });
google.script.run.withSuccessHandler(function(data) {
CONTRACTS = data || [];
renderContractGrid();
}).withFailureHandler(function() {
renderContractGrid();
}).getContracts();
if (IS_LEGAL_TEAM === 'true') {
document.getElementById('nav-inqmgmt').style.display = 'block';
document.getElementById('nav-reviewmgmt').style.display = 'block';
} else {
document.getElementById('nav-myinquiry').style.display = 'block';
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

// ════════════════════════════════════════════════════════════
//  미리보기 기능 — app.js에 추가
//  기존 참고자료 모달(ref-modal)을 재활용하여 새 창처럼 표시
// ════════════════════════════════════════════════════════════

async function previewCurrentContract() {
  if (!currentContract || !validateCurrentForm()) {
    showAlert('필수 항목을 모두 입력해주세요.', { title: '입력 필요', icon: '⚠️' });
    return;
  }

  var previewBtn = document.getElementById('preview-btn');
  if (previewBtn) { previewBtn.disabled = true; previewBtn.textContent = '미리보기 생성 중...'; }

  var raw = collectFormData();
  var toKo = function(d) { if (!d) return ''; var p = d.split('-'); return p.length === 3 ? p[0] + '년 ' + p[1] + '월 ' + p[2] + '일' : d; };
  var fmtN = function(n) { var s = String(n).replace(/[^0-9]/g, ''); return s ? Number(s).toLocaleString('ko-KR') : ''; };
  var dateF = ['contract_date','service_start','service_end','ad_start','ad_end','media_start','media_end','reward_start','reward_end','original_contract_date','SIGN_DATE'];
  var numF = ['service_cost','total_amount','monthly_fee','contract_amount','ad_budget','cpa_rate'];

  var payload = { contractType: currentContract.id, contractName: currentContract.name };
  Object.keys(raw).forEach(function(k) {
    if (dateF.includes(k)) payload[k] = toKo(raw[k]);
    else if (numF.includes(k)) payload[k] = fmtN(raw[k]);
    else payload[k] = Array.isArray(raw[k]) ? raw[k].join(', ') : raw[k];
  });
  payload.remarks = (payload.remarks && payload.remarks.trim()) || '없음';
  payload.invoice_date = payload.invoice_date || '용역 완료 월의 말일';
  payload.payment_date = payload.payment_date || '세금계산서 발행일 기준 익월 말일 이내';
  payload.userEmail = USER_EMAIL || '';

  try {
    var result = await new Promise(function(resolve, reject) {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(function(err) { reject(new Error(err.message || '미리보기 생성 실패')); })
        .previewContract(JSON.stringify(payload));
    });

    if (!result || !result.ok) throw new Error((result && result.error) || '미리보기 생성 실패');

    // 기존 참고자료 모달 재활용
    document.getElementById('ref-modal-title').textContent = currentContract.name + ' 미리보기';
    document.getElementById('ref-modal-tabs').style.display = 'none';
    document.getElementById('ref-modal-iframe').src = 'https://docs.google.com/document/d/' + result.fileId + '/preview';
    document.getElementById('ref-modal-overlay').style.display = 'flex';

  } catch(e) {
    showAlert(e.message, { title: '미리보기 오류', icon: '❌' });
  } finally {
    if (previewBtn) { previewBtn.disabled = false; previewBtn.textContent = '👁 미리보기'; }
  }
}
