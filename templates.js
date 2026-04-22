var PAGE_TEMPLATES = {};

PAGE_TEMPLATES.home = `
<section class="snap-section dark-b" id="snap-s0">
<div class="dash-content">
<div class="dash-top"><div><div class="section-label">Live Dashboard</div><div class="dash-title">법무실 진행 현황</div><div class="dash-sub">미처리 문의 및 계약서 검토 요청 실시간 현황</div></div><button class="btn-sm" onclick="loadDashboard()">↻ 새로고침</button></div>
<div class="stat-cards">
<div class="stat-card s-red"><span class="stat-card-label">문의 · 미답변</span><span class="stat-card-right"><span class="stat-card-num" id="sc-inq-pending">—</span><span class="stat-card-unit">건</span></span></div>
<div class="stat-card s-blue"><span class="stat-card-label">문의 · 진행중</span><span class="stat-card-right"><span class="stat-card-num" id="sc-inq-progress">—</span><span class="stat-card-unit">건</span></span></div>
<div class="stat-card s-orange"><span class="stat-card-label">검토 · 대기</span><span class="stat-card-right"><span class="stat-card-num" id="sc-rev-pending">—</span><span class="stat-card-unit">건</span></span></div>
<div class="stat-card s-purple"><span class="stat-card-label">검토 · 진행중</span><span class="stat-card-right"><span class="stat-card-num" id="sc-rev-progress">—</span><span class="stat-card-unit">건</span></span></div>
<div class="stat-card s-green"><span class="stat-card-label">검토 · 합의완료</span><span class="stat-card-right"><span class="stat-card-num" id="sc-rev-agreed">—</span><span class="stat-card-unit">건</span></span></div>
</div>
<div class="dash-tables-grid">
<div class="dash-table-wrap"><div class="dash-table-header"><h4>💬 문의 현황 (미처리)</h4><span id="inq-dash-count">로드 중...</span></div><div class="dash-table-scroll"><table class="ct-table dash-table"><thead><tr><th style="width:150px;">문의자</th><th style="width:180px;">문의유형</th><th>문의제목</th><th style="width:110px;" class="hide-mobile">요청일</th><th style="width:100px;">상태</th><th style="width:130px;" class="hide-mobile">진행자</th></tr></thead><tbody id="dash-inq-tbody"><tr><td colspan="6"><div class="dash-empty">⏳ 로드 중...</div></td></tr></tbody></table></div><div class="dash-pagination" id="inq-pagination" style="display:none;"><button class="pg-btn" id="inq-prev" onclick="changeDashPage('inq',-1)">‹ 이전</button><span class="pg-info" id="inq-pg-info">1 / 1</span><button class="pg-btn" id="inq-next" onclick="changeDashPage('inq',1)">다음 ›</button></div></div>
<div class="dash-table-wrap"><div class="dash-table-header"><h4>📋 계약서 검토 현황 (미처리)</h4><span id="rev-dash-count">로드 중...</span></div><div class="dash-table-scroll"><table class="ct-table dash-table"><thead><tr><th style="width:150px;">요청자</th><th style="width:110px;">당사자</th><th style="width:90px;">계약유형</th><th>계약서명</th><th style="width:110px;" class="hide-mobile">요청일</th><th style="width:100px;">상태</th><th style="width:130px;" class="hide-mobile">진행자</th></tr></thead><tbody id="dash-rev-tbody"><tr><td colspan="7"><div class="dash-empty">⏳ 로드 중...</div></td></tr></tbody></table></div><div class="dash-pagination" id="rev-pagination" style="display:none;"><button class="pg-btn" id="rev-prev" onclick="changeDashPage('rev',-1)">‹ 이전</button><span class="pg-info" id="rev-pg-info">1 / 1</span><button class="pg-btn" id="rev-next" onclick="changeDashPage('rev',1)">다음 ›</button></div></div>
</div>
</div>
<div class="scroll-hint light"><span>Scroll</span><div class="sh-arrow">↓</div></div>
</section>
<section class="snap-section dark" id="snap-s1"><div class="service-inner"><div class="svc-eyebrow">Contract</div><div class="svc-icon-wrap">📝</div><div class="svc-title">계약서 작성 및 검토</div><div class="svc-desc">표준계약서를 자동으로 생성하거나,<br>고객사 양식 계약서를 업로드하여 법무실에 검토를 요청하세요.</div><div class="svc-features"><span class="svc-feature">📄 IGAW · ADP · FIXTYPE 표준계약서 자동 생성</span><span class="svc-feature">🔍 비표준계약서 법무실 검토 요청</span><span class="svc-feature">📬 다운로드 · Slack · 이메일로 계약서 전달</span></div><button class="svc-cta" onclick="showPage('contract')">계약서 작성하기 →</button></div><div class="scroll-hint dark"><span>Scroll</span><div class="sh-arrow">↓</div></div></section>
<section class="snap-section dark-b" id="snap-s2"><div class="service-inner"><div class="svc-eyebrow">Submission</div><div class="svc-icon-wrap">📤</div><div class="svc-title">계약서 원본 제출</div><div class="svc-desc">미제출 계약 목록에서 계약을 선택하면 모든 정보가 자동으로 입력됩니다.<br>PDF 파일을 첨부하고 바로 제출하세요.</div><div class="svc-features"><span class="svc-feature">🔄 계약 현황 리스트 실시간 연동</span><span class="svc-feature">📁 Google Drive 자동 저장</span><span class="svc-feature">✅ 제출 상태 자동 업데이트</span></div><button class="svc-cta" onclick="showPage('submit')">계약서 제출하기 →</button></div><div class="scroll-hint dark"><span>Scroll</span><div class="sh-arrow">↓</div></div></section>
<section class="snap-section dark-p" id="snap-s3"><div class="service-inner"><div class="svc-eyebrow">Inquiry</div><div class="svc-icon-wrap">💬</div><div class="svc-title">법무실 문의하기</div><div class="svc-desc">ERP 등록, 티그리스 품의, 체결된 계약서 확인 등 법무 관련 문의를 남겨주세요.<br>확인 후 Slack 또는 이메일로 답변드립니다.</div><div class="svc-features"><span class="svc-feature">🔍 체결된 계약서 확인 요청</span><span class="svc-feature">✏️ ERP · 티그리스 품의 문의</span><span class="svc-feature">⚖️ 법률 자문 · 기타 문의</span></div><button class="svc-cta" onclick="showPage('inquiry')">문의 접수하기 →</button></div><div class="scroll-hint dark"><span>Scroll</span><div class="sh-arrow">↓</div></div></section>
<section class="snap-section dark-g" id="snap-s4"><div class="service-inner"><div class="svc-eyebrow">Reference</div><div class="svc-icon-wrap">📚</div><div class="svc-title">참고 자료</div><div class="svc-desc">전결규정, 법무 매뉴얼 등 업무에 필요한 참고 자료를 확인하세요.</div><div class="ref-grid"><div class="ref-card" onclick="openRef('approval')" style="cursor:pointer;"><div class="ref-card-icon">📋</div><div class="ref-card-title">전결규정</div></div><div class="ref-card" onclick="openRef('manual')" style="cursor:pointer;"><div class="ref-card-icon">📖</div><div class="ref-card-title">법무 매뉴얼</div></div><div class="ref-card" onclick="openRef('guide')" style="cursor:pointer;"><div class="ref-card-icon">📝</div><div class="ref-card-title">계약서 작성 가이드</div></div></div></div></section>
`;

PAGE_TEMPLATES.contract = `
<div class="contract-page">
<button class="page-back" onclick="goBack('contract')">← 뒤로가기</button>
<div id="contract-type-select-view"><div class="section-label">Contract</div><div class="page-title">계약서 작성 및 검토</div><div class="page-subtitle">계약서 유형을 선택합니다</div><div style="display:grid;grid-template-columns:1fr;gap:16px;max-width:100%;"><div class="menu-card" onclick="selectContractMode('standard')"><div class="menu-icon">📝</div><div class="menu-arrow">→</div><h3>표준계약서</h3><p>IGAW · FIXTYPE · ADP 표준 양식을 자동으로 생성하고 다운로드, Slack 또는 메일로 전달받으세요.</p><div style="margin-top:14px;display:flex;gap:6px;flex-wrap:wrap;"><span class="tag igaw" style="margin-bottom:0;">IGAW</span><span class="tag fixtype" style="margin-bottom:0;">FIXTYPE</span><span class="tag adp" style="margin-bottom:0;">ADP</span></div></div><div class="menu-card" onclick="selectContractMode('nonstandard')"><div class="menu-icon">📋</div><div class="menu-arrow">→</div><h3>비표준계약서</h3><p>고객사 양식 계약서 및 부속서류를 첨부하여 검토를 요청해주세요.</p><div style="margin-top:14px;"><span class="tag" style="background:#f0fdf4;color:#166534;margin-bottom:0;">고객사 양식</span><span class="tag" style="background:#f0fdf4;color:#166534;margin-bottom:0;">비딩제안참가서</span><span class="tag" style="background:#f0fdf4;color:#166534;margin-bottom:0;">비밀유지서약서</span><span class="tag" style="background:#f0fdf4;color:#166534;margin-bottom:0;">청렴이행서약서</span></div></div></div></div>
<div id="contract-list-view" style="display:none;"><button class="page-back" onclick="showContractTypeSelect()" style="margin-bottom:24px;">← 유형 선택으로</button><div class="section-label">Contract Generator</div><div class="page-title">표준계약서 작성</div><div class="page-subtitle">계약서 유형을 선택하면 작성폼으로 이동합니다</div><div class="company-tabs"><button class="company-tab active" onclick="filterCompany('IGAW',event)">IGAW</button><button class="company-tab" onclick="filterCompany('FIXTYPE',event)">FIXTYPE</button><button class="company-tab" onclick="filterCompany('ADP',event)">ADP</button></div><div class="contract-type-grid" id="contract-grid"></div></div>
<div id="contract-form-view" style="display:none;"><button class="page-back" onclick="showContractList()">← 계약서 목록으로</button><div id="contract-form-container"></div></div>
<div id="contract-nonstandard-view" style="display:none;"><button class="page-back" onclick="showContractTypeSelect()" style="margin-bottom:24px;">← 유형 선택으로</button><div class="section-label">Non-Standard Contract Review</div><div class="page-title">비표준계약서 검토 요청</div><div class="page-subtitle">고객사 양식 계약서를 첨부하고 검토를 요청하세요</div><div id="nonstandard-form-wrap"><div class="form-container"><div class="form-header"><div class="form-header-left"><div class="form-tag">NON-STANDARD · Legal Review</div><h3>비표준계약서 검토 요청</h3></div></div><div class="form-body"><div class="field-section-title">계약당사자 선택</div><div class="company-tabs" style="margin-bottom:24px;"><button type="button" class="company-tab" onclick="selectNsParty('IGAW',this)">IGAW</button><button type="button" class="company-tab" onclick="selectNsParty('ADP',this)">ADP</button><button type="button" class="company-tab" onclick="selectNsParty('FIXTYPE',this)">FIXTYPE</button></div><input type="hidden" id="ns-contract-party" value=""><div class="field-section-title">계약서 정보</div><div class="form-grid" style="margin-bottom:20px;"><div class="form-group span-2"><label>계약서명 <span class="req">*</span></label><input type="text" id="ns-contract-name" placeholder="예: (주)ABC 서비스 이용계약서" oninput="checkNsReady()"></div><div class="form-group span-2"><label>계약상대방 <span class="req">*</span></label><input type="text" id="ns-counter-party" placeholder="예: (주)ABC" oninput="checkNsReady()"></div></div><div class="field-section-title">계약서 파일 첨부 <span class="req">*</span></div><div style="margin-bottom:20px;"><div class="attach-zone" onclick="document.getElementById('ns-file-input').click()"><input type="file" id="ns-file-input" multiple accept=".pdf,.doc,.docx,.hwp,.xlsx,.xls" onchange="handleNsFileSelect(event)"><div class="attach-zone-icon">📎</div><div class="attach-zone-text"><strong>계약서 파일 첨부</strong> · 클릭하여 파일 선택 (PDF, Word, HWP 등 · 파일당 최대 20MB)</div></div><div class="attach-file-list" id="ns-attach-list"></div></div><div class="review-section" style="margin:0;"><label class="review-toggle" style="cursor:default;"><div><div class="review-toggle-label">⚖️ 법무실 검토 요청</div></div></label><div class="review-fields" style="display:flex;"><div class="form-group"><label>검토 요청 의견</label><textarea id="ns-opinion" placeholder="검토가 필요한 부분이나 특이사항을 작성해 주세요."></textarea></div><div class="form-group"><label>추가 수신자 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="ns-to-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete('ns-to-input','ns-to-ac')" onkeydown="handleAcKeydown(event,'ns-to-input','ns-to-ac','ns-to')"><div class="autocomplete-list" id="ns-to-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addNsRecipient('to')">+ 수신</button></div><div class="recipient-tags" id="ns-to-tags"></div></div><div class="form-group"><label>참조(CC) 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="ns-cc-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete('ns-cc-input','ns-cc-ac')" onkeydown="handleAcKeydown(event,'ns-cc-input','ns-cc-ac','ns-cc')"><div class="autocomplete-list" id="ns-cc-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addNsRecipient('cc')">+ 참조</button></div><div class="recipient-tags" id="ns-cc-tags"></div></div></div></div></div><div class="form-footer"><div class="form-footer-note"><strong>*</strong> 필수 항목</div><div class="btn-row"><button class="btn btn-ghost" onclick="showContractTypeSelect()">취소</button><button class="btn btn-gold" id="ns-submit-btn" onclick="submitNonStandard()" disabled>검토 요청 →</button></div></div></div></div></div>
<div id="contract-modified-review-view" style="display:none;"><button class="page-back" onclick="showModifiedReviewBack()" style="margin-bottom:24px;">\u2190 \uACC4\uC57D\uC11C \uBAA9\uB85D\uC73C\uB85C</button><div class="section-label">Standard Contract \u00b7 Modified Review</div><div class="page-title">\uD45C\uC900\uACC4\uC57D\uC11C \uC218\uC815\uBCF8 \uAC80\uD1A0 \uC694\uCCAD</div><div class="page-subtitle">\uD45C\uC900\uACC4\uC57D\uC11C \uC591\uC2DD\uC744 \uB2E4\uC6B4\uB85C\uB4DC\uD558\uC5EC \uC218\uC815\uD55C \uACBD\uC6B0, \uC218\uC815\uBCF8\uC744 \uCCA8\uBD80\uD558\uACE0 \uBC95\uBB34\uC2E4\uC5D0 \uAC80\uD1A0\uB97C \uC694\uCCAD\uD558\uC138\uC694</div><div class="form-container"><div class="form-header"><div class="form-header-left"><div class="form-tag">STANDARD MODIFIED \u00b7 Legal Review</div><h3>\uC218\uC815\uBCF8 \uAC80\uD1A0 \uC694\uCCAD</h3></div></div><div class="form-body"><div class="field-section-title">\uACC4\uC57D\uC11C \uC815\uBCF4 (\uC790\uB3D9 \uC785\uB825)</div><input type="hidden" id="mod-contract-party-val" value=""><input type="hidden" id="mod-contract-name-val" value=""><input type="hidden" id="mod-contract-id" value=""><div class="form-grid" style="margin-bottom:20px;"><div class="form-group"><label>\uACC4\uC57D\uB2F9\uC0AC\uC790</label><div id="mod-contract-party" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;font-size:0.9rem;font-weight:600;color:var(--ink);">\u2014</div></div><div class="form-group"><label>\uACC4\uC57D\uC11C\uBA85</label><div id="mod-contract-name" style="padding:10px 12px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;font-size:0.9rem;font-weight:600;color:var(--ink);">\u2014</div></div></div><div class="field-section-title">\uACC4\uC57D\uC0C1\uB300\uBC29</div><div class="form-grid" style="margin-bottom:20px;"><div class="form-group span-2"><label>\uACC4\uC57D\uC0C1\uB300\uBC29 <span class="req">*</span></label><input type="text" id="mod-counter-party" placeholder="\uC608: (\uC8FC)ABC" oninput="checkModReady()"></div></div><div class="field-section-title">\uC218\uC815\uB41C \uACC4\uC57D\uC11C \uD30C\uC77C \uCCA8\uBD80 <span class="req">*</span></div><div style="margin-bottom:20px;"><div class="attach-zone" onclick="document.getElementById('mod-file-input').click()"><input type="file" id="mod-file-input" multiple accept=".pdf,.doc,.docx,.hwp,.xlsx,.xls" onchange="handleModFileSelect(event)"><div class="attach-zone-icon">\uD83D\uDCCE</div><div class="attach-zone-text"><strong>\uC218\uC815\uB41C \uACC4\uC57D\uC11C \uD30C\uC77C \uCCA8\uBD80</strong> \u00b7 \uD074\uB9AD\uD558\uC5EC \uD30C\uC77C \uC120\uD0DD (PDF, Word, HWP \uB4F1 \u00b7 \uD30C\uC77C\uB2F9 \uCD5C\uB300 20MB)</div></div><div class="attach-file-list" id="mod-attach-list"></div></div><div class="review-section" style="margin:0;"><label class="review-toggle" style="cursor:default;"><div><div class="review-toggle-label">\u2696\uFE0F \uBC95\uBB34\uC2E4 \uAC80\uD1A0 \uC694\uCCAD</div></div></label><div class="review-fields" style="display:flex;"><div class="form-group"><label>\uAC80\uD1A0 \uC694\uCCAD \uC758\uACAC</label><textarea id="mod-opinion" placeholder="\uC218\uC815\uD55C \uBD80\uBD84\uC774\uB098 \uAC80\uD1A0\uAC00 \uD544\uC694\uD55C \uC0AC\uD56D\uC744 \uC791\uC131\uD574 \uC8FC\uC138\uC694."></textarea></div><div class="form-group"><label>\uCD94\uAC00 \uC218\uC2E0\uC790 \uC774\uBA54\uC77C <span style="font-weight:400;color:var(--text-muted);">(\uC120\uD0DD)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="mod-to-input" placeholder="\uC774\uB984 \uB610\uB294 \uC774\uBA54\uC77C \uC785\uB825..." autocomplete="new-password" oninput="showAutocomplete(\'mod-to-input\',\'mod-to-ac\')" onkeydown="handleAcKeydown(event,\'mod-to-input\',\'mod-to-ac\',\'mod-to\')"><div class="autocomplete-list" id="mod-to-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addModRecipient(\'to\')">+ \uC218\uC2E0</button></div><div class="recipient-tags" id="mod-to-tags"></div></div><div class="form-group"><label>\uCC38\uC870(CC) \uC774\uBA54\uC77C <span style="font-weight:400;color:var(--text-muted);">(\uC120\uD0DD)</span></label><div class="review-recipients"><div class="autocomplete-wrap"><input type="text" id="mod-cc-input" placeholder="\uC774\uB984 \uB610\uB294 \uC774\uBA54\uC77C \uC785\uB825..." autocomplete="new-password" oninput="showAutocomplete(\'mod-cc-input\',\'mod-cc-ac\')" onkeydown="handleAcKeydown(event,\'mod-cc-input\',\'mod-cc-ac\',\'mod-cc\')"><div class="autocomplete-list" id="mod-cc-ac" style="display:none;"></div></div><button class="btn-add-recipient" onclick="addModRecipient(\'cc\')">+ \uCC38\uC870</button></div><div class="recipient-tags" id="mod-cc-tags"></div></div></div></div></div><div class="form-footer"><div class="form-footer-note"><strong>*</strong> \uD544\uC218 \uD56D\uBAA9</div><div class="btn-row"><button class="btn btn-ghost" onclick="showModifiedReviewBack()">\uCDE8\uC18C</button><button class="btn btn-gold" id="mod-submit-btn" onclick="submitModifiedReview()" disabled>\uAC80\uD1A0 \uC694\uCCAD \u2192</button></div></div></div></div>
</div>
`;

PAGE_TEMPLATES.submit = `
<div class="contract-page wide">
<button class="page-back" onclick="goBack('submit')">← 뒤로가기</button>
<div class="section-label">Document Submission</div>
<div class="page-title">계약서 원본 제출</div>
<div class="page-subtitle">미제출 계약 목록에서 제출할 계약을 선택하면 모든 정보가 자동으로 입력됩니다</div>
<div id="submit-flow" class="submit-wrapper">
<div class="info-box"><div class="info-box-icon">ℹ️</div><p>아래 목록은 <strong>미제출 계약</strong>을 실시간으로 조회합니다.<br>제출 대상 계약을 선택한 후 <strong>PDF 파일을 첨부하여 제출</strong>하면 구글 드라이브에 자동 저장되고, 제출 상태가 <strong>'제출완료'</strong>로 즉시 업데이트됩니다.<br>제출된 계약서에 오류가 확인될 경우, <strong>반려 처리되며 관련 의견이 Slack 또는 메일로 전달됩니다.</strong></p></div>
<div class="search-bar"><input type="text" id="list-search" placeholder="🔍  계약명, 계약상대방, 관리번호, 기안자 검색..." oninput="filterList()"><button class="btn-sm" onclick="refreshContractList()">↻ 새로고침</button></div>
<div class="list-card"><div class="list-card-header"><h4>📋 미제출 계약 목록</h4><span class="lc-count" id="list-count">로드 중...</span></div><div class="ct-table-wrap"><table class="ct-table"><colgroup><col style="width:28px"><col style="width:72px"><col style="width:145px"><col style="width:200px"><col><col style="width:82px"><col style="width:82px"><col style="width:100px"><col style="width:85px"><col style="width:60px"></colgroup><thead><tr><th class="col-radio"></th><th class="col-party">계약당사자</th><th class="col-counter">계약상대방</th><th class="col-mgmt hide-mobile">관리번호</th><th class="col-name">계약명</th><th class="col-date hide-mobile">계약 시작일</th><th class="col-date hide-mobile">계약 종료일</th><th class="col-drafter hide-mobile">기안자</th><th class="col-status">상태</th><th class="col-confirm hide-mobile">법무실<br>확인</th></tr></thead><tbody id="ct-tbody"><tr><td colspan="10"><div class="dash-empty">⏳ 로드 중...</div></td></tr></tbody></table></div></div>
<div class="sel-panel" id="sel-panel" style="display:none;"><div class="sel-panel-head"><h4>✅ 선택된 계약 정보</h4><span class="autofill-badge">자동 입력됨</span></div><div class="sel-grid" id="sel-grid"></div><div class="filename-row"><div class="fr-icon">📄</div><div><div class="fr-lbl">드라이브에 저장될 파일명</div><div class="fr-name" id="fr-name">—</div></div></div><div class="upload-zone" id="upload-zone" onclick="document.getElementById('pdf-input').click()" ondragover="event.preventDefault();this.classList.add('drag')" ondragleave="this.classList.remove('drag')" ondrop="handleFileDrop(event)"><input type="file" id="pdf-input" accept=".pdf,application/pdf" onchange="handleFileSelect(event)"><div class="uz-icon">📎</div><h5>PDF 파일을 클릭하거나 드래그하여 첨부</h5><p>PDF 형식만 가능 · 최대 50MB</p></div><div class="file-selected" id="file-selected" style="display:none;"><div class="fs-icon">📄</div><div class="fs-info"><div class="fs-name" id="fs-name">—</div><div class="fs-size" id="fs-size">—</div></div><button class="fs-remove" onclick="removeFile()">✕</button></div><div class="upload-progress" id="upload-progress" style="display:none;"><div class="up-label"><span id="up-status">업로드 중...</span><span id="up-pct">0%</span></div><div class="up-bar-wrap"><div class="up-bar" id="up-bar"></div></div></div><div class="sel-panel-foot"><p>PDF 첨부 오류 발생 시 법무실로 요청하시기 바랍니다.</p><div class="btn-row"><button class="btn btn-ghost" onclick="clearSel()">선택 해제</button><button class="btn btn-gold" id="submit-pdf-btn" onclick="submitPDF()" disabled>제출하기 →</button></div></div></div>
</div></div>
`;

PAGE_TEMPLATES.inquiry = `
<div class="contract-page">
<button class="page-back" onclick="goBack('inquiry')">← 뒤로가기</button>
<div class="section-label">Legal Inquiry</div>
<div class="page-title">문의하기</div>
<div class="page-subtitle">ERP 등록, 티그리스 품의, 체결된 계약서 확인 등 법무 관련 문의를 남겨주세요</div>
<div id="inquiry-main">
<div class="inquiry-intro"><div class="icon">⚖️</div><div><h4>법무실 안내</h4><p><br>업무에 필요한 기본 사항은 <strong style="color:var(--gold);">전결규정</strong>, <strong style="color:var(--gold);">법무 매뉴얼</strong> 등 참고 자료 확인 부탁드립니다.<br><strong style="color:var(--gold);">법률 자문</strong>은 문의자 E-MAIL을 통해 답변이 전송됩니다.</p></div></div>
<div class="form-container"><div class="form-header"><div class="form-header-left"><div class="form-tag">INQUIRY</div><h3>문의 내용 작성</h3></div></div><div class="form-body"><div class="field-section-title">문의자 정보</div><div class="form-grid" style="margin-bottom:20px;"><div class="form-group"><label>이름 <span class="req">*</span></label><div class="autocomplete-wrap"><input type="text" id="inq-name" placeholder="예: 홍길동" autocomplete="new-password" oninput="showInqNameAc();checkInquiryReady()"><div class="autocomplete-list" id="inq-name-ac" style="display:none;"></div></div></div><div class="form-group"><label>부서 <span class="req">*</span></label><input type="text" id="inq-dept" placeholder="예: 파트너십팀" oninput="checkInquiryReady()"></div></div><div class="field-section-title">문의 유형 선택</div><div class="category-grid"><div class="category-card" onclick="selectCategory(this,'체결된 계약서 확인 요청')"><div class="cat-icon">🔍</div><div class="cat-text">체결된 계약서 확인 요청</div></div><div class="category-card" onclick="selectCategory(this,'ERP 및 티그리스 품의 문의')"><div class="cat-icon">✏️</div><div class="cat-text">ERP 및 티그리스 품의 문의</div></div><div class="category-card" onclick="selectCategory(this,'법률 자문')"><div class="cat-icon">⚖️</div><div class="cat-text">법률 자문</div></div><div class="category-card" onclick="selectCategory(this,'기타 문의')"><div class="cat-icon">💬</div><div class="cat-text">기타 문의</div></div></div><div id="inq-legal-recipients" style="display:none;">
  <div class="form-group">
    <label>추가 수신자 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label>
    <div class="review-recipients">
      <div class="autocomplete-wrap" style="flex:1;">
        <input type="text" id="inq-legal-to-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete('inq-legal-to-input','inq-legal-to-ac')" onkeydown="handleAcKeydown(event,'inq-legal-to-input','inq-legal-to-ac','inq-legal-to')">
        <div class="autocomplete-list" id="inq-legal-to-ac" style="display:none;"></div>
      </div>
      <button class="btn-add-recipient" onclick="addInqLegalRecipient('to')">+ 수신</button>
    </div>
    <div class="recipient-tags" id="inq-legal-to-tags"></div>
  </div>
  <div class="form-group">
    <label>참조(CC) 이메일 <span style="font-weight:400;color:var(--text-muted);">(선택)</span></label>
    <div class="review-recipients">
      <div class="autocomplete-wrap" style="flex:1;">
        <input type="text" id="inq-legal-cc-input" placeholder="이름 또는 이메일 입력..." autocomplete="new-password" oninput="showAutocomplete('inq-legal-cc-input','inq-legal-cc-ac')" onkeydown="handleAcKeydown(event,'inq-legal-cc-input','inq-legal-cc-ac','inq-legal-cc')">
        <div class="autocomplete-list" id="inq-legal-cc-ac" style="display:none;"></div>
      </div>
      <button class="btn-add-recipient" onclick="addInqLegalRecipient('cc')">+ 참조</button>
    </div>
    <div class="recipient-tags" id="inq-legal-cc-tags"></div>
  </div>
</div><div class="field-section-title">문의 내용</div><div class="form-grid cols-1" style="margin-bottom:20px;"><div class="form-group"><label>제목 <span class="req">*</span></label><input type="text" id="inq-title" placeholder="예: (주)ABC와 체결된 계약서 확인 요청" oninput="checkInquiryReady()"></div><div class="form-group"><label>상세 내용 <span class="req">*</span></label><textarea id="inq-content" rows="6" placeholder="문의 내용을 상세히 작성해 주세요." oninput="checkInquiryReady()"></textarea></div><div class="form-group"><div class="hint" style="margin-top:0;">체결된 계약서 확인 요청 시에는 ERP 계약관리번호, 계약 상대방, 계약명을 특정하여 주시기 바랍니다.</div></div></div><div class="field-section-title">파일 첨부 <span style="font-weight:400;color:var(--text-muted);font-size:0.78rem;letter-spacing:0;">(선택)</span></div><div style="padding:0 0 24px;"><div class="attach-zone" onclick="document.getElementById('inq-form-attach-input').click()"><input type="file" id="inq-form-attach-input" multiple onchange="handleAttachSelect('inq-form')"><div class="attach-zone-icon">📎</div><div class="attach-zone-text"><strong>파일 첨부</strong> · 클릭하여 파일 선택 (모든 형식 · 파일당 최대 20MB · 링크로 전송 · 3영업일 후 자동 삭제)</div></div><div class="attach-file-list" id="inq-form-attach-list"></div></div></div><div class="form-footer"><div class="form-footer-note"><strong>*</strong> 필수 항목</div><div class="btn-row"><button class="btn btn-ghost" onclick="showPage('home')">취소</button><button class="btn btn-gold" id="inquiry-btn" onclick="submitInquiry()" disabled>문의 전송</button></div></div></div>
</div></div>
`;

PAGE_TEMPLATES.myinquiry = '' +
'<div class="contract-page wide">' +
'<button class="page-back" onclick="goBack(\'myinquiry\')">← 뒤로가기</button>' +
'<div class="section-label">MY INQUIRIES</div>' +
'<div class="page-title">내 문의 현황</div>' +
'<div class="page-subtitle">내가 접수한 문의 내역과 답변을 확인하세요.<br>💡매월 1일, <b>답변완료</b>된 문의 내역은 삭제됩니다.</div>' + 

'<div class="search-bar">' +
'<input type="text" id="myinq-search" placeholder="🔍  유형, 제목 검색..." oninput="filterMyInqTable()">' +
'</div>' +

'<div class="list-card">' +
'<div class="list-card-header"><h4>📋 내 문의 목록</h4><span class="lc-count" id="myinq-list-count">로드 중...</span></div>' +
'<div class="ct-table-wrap"><table class="ct-table">' +
'<colgroup><col style="width:28px"><col style="min-width:120px"><col><col class="hide-mobile" style="min-width:200px"><col style="min-width:90px"></colgroup>' +
'<thead><tr>' +
'<th class="col-radio"></th>' +
'<th style="text-align:center;white-space:nowrap;">유형</th>' +
'<th>제목</th>' +
'<th class="hide-mobile" style="text-align:center;white-space:nowrap;">접수일</th>' +
'<th style="text-align:center;white-space:nowrap;">상태</th>' +
'</tr></thead>' +
'<tbody id="myinq-tbody"></tbody>' +
'</table></div></div>' +

'<div class="rev-detail-panel" id="myinq-detail-panel" style="display:none;">' +
'<div class="rev-detail-head">' +
'<h4 id="myinq-detail-title"></h4>' +
'<span id="myinq-detail-status-badge" class="inq-status-badge"></span>' +
'</div>' +
'<div class="rev-detail-body">' +

'<div class="rev-detail-meta" id="myinq-detail-meta"></div>' +

'<div style="padding:0 28px 16px;">' +
'<div style="font-weight:600;font-size:0.82rem;color:var(--ink-3);margin-bottom:6px;">💬 문의 내용</div>' +
'<div id="myinq-detail-content" style="font-size:0.84rem;color:var(--text);line-height:1.7;white-space:pre-wrap;background:var(--surface);padding:14px 16px;border-radius:10px;border:1px solid var(--border);"></div>' +
'</div>' +

'<div id="myinq-answer-wrap" style="display:none;padding:0 28px 16px;">' +
'<div style="font-weight:600;font-size:0.82rem;color:var(--ink-3);margin-bottom:6px;">📨 법무실 답변</div>' +
'<div id="myinq-answer-meta" style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;"></div>' +
'<div id="myinq-answer-text" style="font-size:0.84rem;color:var(--text);line-height:1.7;white-space:pre-wrap;background:#faf8f0;padding:14px 16px;border-radius:10px;border:1px solid var(--border);"></div>' +
'<div id="myinq-answer-attach" style="margin-top:8px;"></div>' +
'</div>' +

'<div id="myinq-waiting-wrap" style="display:none;padding:0 28px 16px;">' +
'<div style="font-size:0.82rem;color:var(--text-muted);padding:14px 16px;background:var(--surface);border-radius:10px;border:1px solid var(--border);">⏳ 답변 대기 중 · 확인 후 순차적으로 Slack 또는 메일로 답변드리겠습니다.</div>' +
'</div>' +

'</div>' +
'<div class="rev-detail-foot"><button class="btn btn-ghost" onclick="clearMyInqSel()">닫기</button></div>' +
'</div>' +
'</div>';

PAGE_TEMPLATES.inqmgmt = `
<div class="contract-page wide">
<button class="page-back" onclick="goBack('inqmgmt')">← 뒤로가기</button>
<div class="section-label">Inquiry Management</div>
<div class="page-title">문의 관리</div>
<div class="page-subtitle">접수된 문의 목록을 확인하고 답변을 전송하세요</div>
<div class="search-bar"><input type="text" id="inq-search" placeholder="🔍  문의자, 유형, 제목 검색..." oninput="filterInqTable()"><button class="btn-sm" onclick="loadInqMgmt()">↻ 새로고침</button></div>
<div class="list-card"><div class="list-card-header"><h4>📋 문의 목록</h4><span class="lc-count" id="inq-list-count">로드 중...</span></div><div class="ct-table-wrap"><table class="ct-table"><thead><tr><th class="col-radio"></th><th class="col-inq-name">문의자</th><th class="col-inq-type">문의 유형</th><th class="col-inq-title">문의 제목</th><th class="col-inq-date hide-mobile">접수일</th><th class="col-inq-status">상태</th><th class="col-inq-assignee hide-mobile">진행자</th></tr></thead><tbody id="inq-tbody"><tr><td colspan="7"><div class="dash-empty">⏳ 로드 중...</div></td></tr></tbody></table></div></div>
<div class="inq-detail-panel" id="inq-detail-panel" style="display:none;"><div class="inq-detail-head"><h4 id="inq-detail-title">문의 상세</h4><span id="inq-detail-status-badge" class="inq-status-badge inq-status-pending">미답변</span></div><div class="inq-detail-body"><div class="inq-detail-meta" id="inq-detail-meta"></div><div class="inq-content-box"><div class="inq-content-label">📝 문의 내용</div><div class="inq-content-text" id="inq-detail-content"></div></div><div id="inq-detail-answer" style="display:none;"></div></div>
<div class="inq-reply-section" id="inq-reply-section"><label>✏️ 답변 작성</label><textarea id="inq-reply-textarea" placeholder="답변 내용을 입력하세요..."></textarea><div class="attach-zone" onclick="document.getElementById('inq-attach-input').click()"><input type="file" id="inq-attach-input" multiple onchange="handleAttachSelect('inq')"><div class="attach-zone-icon">📎</div><div class="attach-zone-text"><strong>파일 첨부</strong> · 클릭하여 파일 선택 (모든 형식 · 파일당 최대 20MB · 링크로 전송 · 3영업일 후 자동 삭제)</div></div><div class="attach-file-list" id="inq-attach-list"></div><div class="inq-reply-footer"><p>답변 전송 시 Slack 및 이메일로 자동 발송됩니다.</p><div class="btn-row"><button class="btn btn-ghost" onclick="clearInqSel()">선택 해제</button><button class="btn btn-gold" id="inq-reply-btn" onclick="sendInqReply()">답변 전송 →</button></div></div></div>
<div class="inq-reply-section" id="inq-progress-section" style="display:none;"><div id="inq-progress-info" style="font-family:var(--font);font-size:0.82rem;color:#1a5fa8;background:#e0f0ff;border:1px solid #a8cff0;border-radius:8px;padding:10px 14px;margin-bottom:14px;"></div><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:12px 14px;background:var(--surface);border:1px solid var(--border);border-radius:10px;"><span style="font-family:var(--font);font-size:0.82rem;font-weight:600;color:var(--ink-3);white-space:nowrap;">👤 담당자 변경</span><select id="inq-assignee-select" style="flex:1;font-family:var(--font);font-size:0.85rem;padding:8px 12px;border:1.5px solid var(--border);border-radius:8px;background:var(--white);color:var(--text);"><option value="">담당자 선택...</option></select><button onclick="doChangeAssignee()" style="font-family:var(--font);font-size:0.8rem;font-weight:600;padding:8px 16px;border-radius:8px;border:1.5px solid var(--gold);background:transparent;color:var(--gold);cursor:pointer;white-space:nowrap;transition:all 0.15s;">변경</button></div><label>✏️ 답변 작성</label><textarea id="inq-progress-textarea" placeholder="답변 내용을 입력하세요..."></textarea><div class="attach-zone" onclick="document.getElementById('inq-prog-attach-input').click()"><input type="file" id="inq-prog-attach-input" multiple onchange="handleAttachSelect('inq-prog')"><div class="attach-zone-icon">📎</div><div class="attach-zone-text"><strong>파일 첨부</strong> · 클릭하여 파일 선택 (모든 형식 · 파일당 최대 20MB · 링크로 전송 · 3영업일 후 자동 삭제)</div></div><div class="attach-file-list" id="inq-prog-attach-list"></div><div class="inq-reply-footer"><p>답변 전송 시 Slack 및 이메일로 자동 발송됩니다.</p><div class="btn-row"><button class="btn btn-ghost" onclick="clearInqSel()">선택 해제</button><button class="btn btn-gold" id="inq-progress-reply-btn" onclick="sendInqReply('progress')">답변 전송 →</button></div></div></div>
<div class="inq-reply-section" id="inq-done-section" style="display:none;"><div style="display:flex;justify-content:flex-end;"><button class="btn btn-ghost" onclick="clearInqSel()">닫기</button></div></div>
</div></div>
`;

PAGE_TEMPLATES.reviewmgmt = `
<div class="contract-page wide">
<button class="page-back" onclick="goBack('reviewmgmt')">← 뒤로가기</button>
<div class="section-label">Review Dashboard</div>
<div class="page-title">검토 요청 현황</div>
<div class="page-subtitle">법무실로 요청된 계약 검토 사항을 확인하고 처리하세요</div>
<div class="search-bar"><input type="text" id="rev-search" placeholder="🔍  요청자, 계약서명 검색..." oninput="filterRevTable()"><button class="btn-sm" onclick="loadReviewMgmt()">↻ 새로고침</button></div>
<div class="list-card"><div class="list-card-header"><h4>📋 검토 요청 목록</h4><span class="lc-count" id="rev-list-count">로드 중...</span></div><div class="ct-table-wrap"><table class="ct-table"><thead><tr><th class="col-radio"></th><th class="col-rev-requester">요청자</th><th style="width:110px;">당사자</th><th style="width:80px;">계약유형</th><th class="col-rev-name">계약서명</th><th class="col-rev-date hide-mobile">요청일</th><th class="col-rev-status">상태</th><th class="col-rev-confirmed hide-mobile">진행자</th></tr></thead><tbody id="rev-tbody"><tr><td colspan="8"><div class="dash-empty">⏳ 로드 중...</div></td></tr></tbody></table></div></div>

<div class="rev-detail-panel" id="rev-detail-panel" style="display:none;"><div class="rev-detail-head"><h4 id="rev-detail-title">검토 요청 상세</h4><span id="rev-detail-status-badge" class="rev-status-badge rev-status-pending">검토대기</span></div><div class="rev-detail-body"><div class="rev-detail-meta" id="rev-detail-meta"></div><div id="rev-opinion-wrap" style="display:none;"><div class="rev-opinion-box"><div class="rev-opinion-label">💬 검토 요청 의견</div><div class="rev-opinion-text" id="rev-detail-opinion"></div></div></div><div id="rev-file-wrap" style="display:none;"><a class="rev-file-link" id="rev-file-link" href="#" target="_blank">📄 계약서 파일 열기 →</a></div>

<!-- ═══ 수신자/참조자 정보 표시 ═══ -->
<div id="rev-recipient-info" style="display:none;margin-top:12px;padding:10px 14px;background:#f0f4ff;border:1px solid #c5d4f0;border-radius:8px;font-family:var(--font);font-size:0.8rem;color:#3b5998;line-height:1.6;"></div>

<!-- ═══ 파일 목록 (Review_Case_Folder) ═══ -->
<div id="rev-files-wrap" style="display:none;margin-top:16px;padding:0 0 8px;">
<div style="border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:14px 16px;">
<div style="font-family:var(--font);font-size:0.82rem;font-weight:700;color:var(--ink-3);margin-bottom:10px;">📁 검토 파일 목록</div>
<div id="rev-files-list" style="font-family:var(--font);font-size:0.84rem;color:var(--text);"></div>
</div>
</div>

<div id="rev-confirmed-wrap" style="display:none;"><div class="rev-confirmed-box"><div class="rev-confirmed-text" id="rev-confirmed-text"></div></div></div></div><div id="rev-assignee-wrap-dynamic"></div>

<!-- ═══ 상태별 액션 버튼 영역 ═══ -->
<div id="rev-action-buttons-wrap" style="padding:0 28px 16px;display:none;">
<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;"></div>
</div>

<!-- ═══ 검토 의견 회신 이력 ═══ -->
<div id="rev-reply-history-wrap" style="display:none;padding:0 28px 16px;">
<div style="border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:16px 18px;">
<div style="font-family:var(--font);font-size:0.82rem;font-weight:700;color:var(--ink-3);margin-bottom:10px;">📨 검토 의견 회신 이력</div>
<div id="rev-reply-history-content" style="font-family:var(--font);font-size:0.84rem;color:var(--text);line-height:1.7;white-space:pre-wrap;"></div>
</div>
</div>

<!-- ═══ 검토 의견 작성 + 자주하는 답변 라벨 + RE: 메일 발송 ═══ -->
<div id="rev-reply-section" style="display:none;padding:0 28px 20px;">
<div style="border:1px solid var(--border);border-radius:12px;background:var(--white);padding:20px;">
<label style="font-family:var(--font);font-size:0.88rem;font-weight:700;color:var(--ink);display:block;margin-bottom:10px;">✏️ 검토 의견 작성</label>

<!-- 자주하는 답변 라벨 -->
<div style="margin-bottom:12px;">
<div style="font-family:var(--font);font-size:0.76rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;letter-spacing:0.03em;">🏷️ 자주하는 답변</div>
<div id="rev-quick-labels" style="display:flex;flex-wrap:wrap;gap:6px;">
<button class="rev-quick-label" onclick="insertQuickLabel('검토 결과 특이사항 없습니다. 진행하셔도 됩니다.')">✅ 특이사항 없음</button>
<button class="rev-quick-label" onclick="insertQuickLabel('계약서 내용 검토 완료하였습니다. 날인 진행 부탁드립니다.')">📝 날인 진행 요청</button>
<button class="rev-quick-label" onclick="insertQuickLabel('아래 수정사항 반영 후 재송부 부탁드립니다.')">🔄 수정 후 재송부</button>
<button class="rev-quick-label" onclick="insertQuickLabel('계약 조건 관련 추가 협의가 필요합니다. 미팅 일정 조율 부탁드립니다.')">🤝 추가 협의 필요</button>
<button class="rev-quick-label" onclick="insertQuickLabel('첨부된 수정본 확인 부탁드립니다. 수정 사항은 아래와 같습니다.')">📎 수정본 첨부</button>
<button class="rev-quick-label" onclick="insertQuickLabel('해당 조항은 당사 표준 약관과 상이하여 수정이 필요합니다.')">⚠️ 표준 약관 상이</button>
</div>
</div>

<textarea id="rev-reply-textarea" placeholder="검토 의견을 입력하세요. 작성 후 'RE: 메일 발송' 버튼을 클릭하면 요청자에게 이메일로 회신됩니다." style="width:100%;min-height:280px;font-family:var(--font);padding:12px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:0.88rem;resize:vertical;line-height:1.7;transition:border-color 0.2s;box-sizing:border-box;" onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'"></textarea>

<!-- 파일 첨부 영역 -->
<div style="margin-top:12px;">
<div class="attach-zone" onclick="document.getElementById('rev-reply-attach-input').click()" style="padding:14px;min-height:auto;">
<input type="file" id="rev-reply-attach-input" multiple accept=".pdf,.doc,.docx,.hwp,.xlsx,.xls,.pptx,.ppt" onchange="handleRevReplyAttach(event)" style="display:none;">
<div style="display:flex;align-items:center;gap:10px;justify-content:center;">
<span style="font-size:1.1rem;">📎</span>
<span style="font-family:var(--font);font-size:0.82rem;color:var(--text-muted);"><strong>파일 첨부</strong> · 클릭하여 파일 선택 (PDF, Word, HWP 등 · 파일당 최대 20MB)</span>
</div>
</div>
<div class="attach-file-list" id="rev-reply-attach-list"></div>
</div>

<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;flex-wrap:wrap;gap:8px;">
<p style="font-family:var(--font);font-size:0.76rem;color:var(--text-muted);margin:0;">검토 의견 및 첨부파일은 <strong>이메일</strong>로 발송됩니다. Slack에는 알림만 전달됩니다.</p>
<div style="display:flex;gap:8px;">
<button class="btn btn-ghost" onclick="clearRevReply()" style="font-size:0.84rem;padding:9px 18px;">초기화</button>
<button class="btn btn-gold" id="rev-reply-send-btn" onclick="sendRevReply()" style="font-size:0.84rem;padding:9px 22px;">📧 RE: 메일 발송 →</button>
</div>
</div>
</div>
</div>

<div class="rev-detail-foot" id="rev-detail-foot"><button class="btn btn-ghost" onclick="clearRevSel()">닫기</button><button class="btn btn-gold" id="rev-confirm-btn" onclick="doConfirmReview()" style="display:none;">✅ 검토 확인 완료</button></div></div>
</div>
`;

PAGE_TEMPLATES.myreview = `
<div class="contract-page wide">
<button class="page-back" onclick="goBack('myreview')">← 뒤로가기</button>
<div class="section-label">My Reviews</div>
<div class="page-title">내 검토 현황</div>
<div class="page-subtitle">내가 요청한 계약서 검토 진행 상황을 확인하세요.<br>수신, 참조로 지정된 계약 검토 현황도 함께 표기됩니다.</div>

<div class="search-bar">
<input type="text" id="myrev-search" placeholder="🔍  계약서명 검색..." oninput="filterMyRevTable()">
<button class="btn-sm" onclick="loadMyReviews()">↻ 새로고침</button>
</div>

<div class="list-card">
<div class="list-card-header">
<h4>📋 내 검토 요청 목록</h4>
<span class="lc-count" id="myrev-list-count">로드 중...</span>
</div>
<div class="ct-table-wrap">
<table class="ct-table">
<thead>
<tr>
<th class="col-radio"></th>
<th style="width:110px;">당사자</th>
<th style="width:80px;">계약유형</th>
<th class="col-rev-name">계약서명</th>
<th class="col-rev-date hide-mobile">요청일</th>
<th class="col-rev-status">상태</th>
<th class="col-rev-confirmed hide-mobile">담당자</th>
</tr>
</thead>
<tbody id="myrev-tbody">
<tr><td colspan="7"><div class="dash-empty">⏳ 로드 중...</div></td></tr>
</tbody>
</table>
</div>
</div>

<!-- 상세 패널 -->
<div class="rev-detail-panel" id="myrev-detail-panel" style="display:none;">
<div class="rev-detail-head">
<h4 id="myrev-detail-title">검토 요청 상세</h4>
<span id="myrev-detail-status-badge" class="rev-status-badge rev-status-pending">검토대기</span>
</div>
<div class="rev-detail-body">
<div class="rev-detail-meta" id="myrev-detail-meta"></div>

<div id="myrev-opinion-wrap" style="display:none;">
<div class="rev-opinion-box">
<div class="rev-opinion-label">💬 검토 요청 의견</div>
<div class="rev-opinion-text" id="myrev-detail-opinion"></div>
</div>
</div>

<div id="myrev-file-wrap" style="display:none;">
<a class="rev-file-link" id="myrev-file-link" href="#" target="_blank">📄 계약서 파일 열기 →</a>
</div>

<!-- 파일 목록 -->
<div id="myrev-files-wrap" style="display:none;margin-top:16px;">
<div style="border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:14px 16px;">
<div style="font-family:var(--font);font-size:0.82rem;font-weight:700;color:var(--ink-3);margin-bottom:10px;">📁 검토 파일 목록</div>
<div id="myrev-files-list" style="font-family:var(--font);font-size:0.84rem;color:var(--text);"></div>
</div>
</div>

<!-- 액션 버튼 (회신완료 상태에서만 표시) -->
<div id="myrev-action-wrap" style="display:none;margin-top:16px;padding:0;">
<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;" id="myrev-action-buttons"></div>
</div>

<!-- 재검토 요청 파일 첨부 영역 -->
<div id="myrev-rereview-wrap" style="display:none;margin-top:16px;">
<div style="border:1px solid var(--border);border-radius:12px;background:var(--white);padding:16px;">
<label style="font-family:var(--font);font-size:0.85rem;font-weight:700;color:var(--ink);display:block;margin-bottom:10px;">🔄 재검토 요청</label>
<p style="font-family:var(--font);font-size:0.78rem;color:var(--text-muted);margin:0 0 12px;">수정된 파일이 있으면 첨부해주세요. 파일 없이도 재검토 요청이 가능합니다.</p>
<div class="attach-zone" onclick="document.getElementById('myrev-rereview-attach-input').click()" style="padding:14px;min-height:auto;">
<input type="file" id="myrev-rereview-attach-input" multiple accept=".pdf,.doc,.docx,.hwp,.xlsx,.xls,.pptx,.ppt" onchange="handleMyRevReReviewAttach(event)" style="display:none;">
<div style="display:flex;align-items:center;gap:10px;justify-content:center;">
<span style="font-size:1.1rem;">📎</span>
<span style="font-family:var(--font);font-size:0.82rem;color:var(--text-muted);"><strong>파일 첨부</strong> (선택) · 클릭하여 파일 선택</span>
</div>
</div>
<div class="attach-file-list" id="myrev-rereview-attach-list"></div>
<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
<button class="btn btn-ghost" onclick="cancelMyReReview()" style="font-size:0.84rem;padding:9px 18px;">취소</button>
<button class="btn btn-gold" id="myrev-rereview-submit-btn" onclick="doMyRequestReReview()" style="font-size:0.84rem;padding:9px 20px;">🔄 재검토 요청 전송</button>
</div>
</div>
</div>

</div>
<div class="rev-detail-foot"><button class="btn btn-ghost" onclick="clearMyRevSel()">닫기</button></div>
</div>
</div>
`;

PAGE_TEMPLATES.modals = `
<div id="alert-modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:600;align-items:center;justify-content:center;"><div style="background:var(--white);border-radius:20px;padding:36px 32px;max-width:400px;width:92%;box-shadow:var(--shadow-lg);font-family:var(--font);text-align:center;"><div id="alert-modal-icon" style="font-size:2rem;margin-bottom:14px;">ℹ️</div><div id="alert-modal-title" style="font-size:1rem;font-weight:700;color:var(--ink);margin-bottom:10px;"></div><div id="alert-modal-msg" style="font-size:0.88rem;color:var(--text-muted);line-height:1.7;margin-bottom:28px;white-space:pre-wrap;"></div><button onclick="closeAlertModal()" style="padding:11px 36px;border-radius:10px;border:none;background:var(--ink);color:white;font-family:var(--font);font-size:0.9rem;font-weight:700;cursor:pointer;">확인</button></div></div>
<div id="confirm-modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:600;align-items:center;justify-content:center;"><div style="background:var(--white);border-radius:20px;padding:36px 32px;max-width:400px;width:92%;box-shadow:var(--shadow-lg);font-family:var(--font);text-align:center;"><div id="confirm-modal-icon" style="font-size:2rem;margin-bottom:14px;">❓</div><div id="confirm-modal-title" style="font-size:1rem;font-weight:700;color:var(--ink);margin-bottom:10px;"></div><div id="confirm-modal-msg" style="font-size:0.88rem;color:var(--text-muted);line-height:1.7;margin-bottom:28px;white-space:pre-wrap;"></div><div style="display:flex;gap:10px;justify-content:center;"><button id="confirm-modal-cancel-btn" onclick="closeConfirmModal(false)" style="padding:11px 28px;border-radius:10px;border:1.5px solid var(--border);background:var(--white);font-family:var(--font);font-size:0.88rem;font-weight:600;cursor:pointer;color:var(--text-muted);">취소</button><button id="confirm-modal-ok-btn" onclick="closeConfirmModal(true)" style="padding:11px 28px;border-radius:10px;border:none;background:var(--ink);color:white;font-family:var(--font);font-size:0.88rem;font-weight:700;cursor:pointer;">확인</button></div></div></div>
<div id="confirm-popup-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:500;align-items:center;justify-content:center;"><div style="background:var(--white);border-radius:20px;padding:36px 32px;max-width:480px;width:92%;box-shadow:var(--shadow-lg);font-family:var(--font);"><div style="font-size:0.72rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;">법무실 확인</div><div style="font-size:1.1rem;font-weight:700;color:var(--ink);margin-bottom:6px;" id="popup-contract-label">—</div><div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:28px;" id="popup-contract-sub">—</div><div style="display:flex;gap:12px;margin-bottom:20px;"><button id="popup-approve-btn" onclick="popupSelectAction('approve')" style="flex:1;padding:14px;border-radius:12px;border:2px solid var(--border);background:var(--white);font-family:var(--font);font-size:0.9rem;font-weight:700;cursor:pointer;transition:all 0.2s;color:var(--text-muted);">✅ 승인</button><button id="popup-reject-btn" onclick="popupSelectAction('reject')" style="flex:1;padding:14px;border-radius:12px;border:2px solid var(--border);background:var(--white);font-family:var(--font);font-size:0.9rem;font-weight:700;cursor:pointer;transition:all 0.2s;color:var(--text-muted);">❌ 반려</button></div><div id="popup-reject-area" style="display:none;margin-bottom:20px;"><label style="font-size:0.82rem;font-weight:700;color:var(--ink-3);display:block;margin-bottom:7px;">반려 의견 <span style="color:var(--red);">*</span></label><textarea id="popup-reject-reason" rows="4" placeholder="반려 사유를 작성해 주세요." oninput="checkPopupReady()" style="width:100%;font-family:var(--font);padding:11px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:0.88rem;resize:vertical;line-height:1.6;transition:all 0.2s;"></textarea></div><div style="display:flex;gap:10px;justify-content:flex-end;"><button onclick="closeConfirmPopup()" style="padding:11px 24px;border-radius:10px;border:1.5px solid var(--border);background:var(--white);font-family:var(--font);font-size:0.88rem;font-weight:600;cursor:pointer;color:var(--text-muted);">취소</button><button id="popup-confirm-btn" onclick="submitConfirmPopup()" disabled style="padding:11px 28px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--ink);font-family:var(--font);font-size:0.88rem;font-weight:700;cursor:not-allowed;opacity:0.4;transition:all 0.2s;">확인</button></div></div></div>
`;
