// ════════════════════════════════════════════════════════════
//  IGAW 법무 원스톱 센터 — 계약서 유형 정의 v2
//  GitHub CDN: https://lucy-210726.github.io/legal-assets/contracts.js
//
//  변경점:
//  - autoWrite 플래그 추가 (true: 자동작성 지원, false: 미리보기/다운로드/수정본검토만)
//  - 전체 37개 계약서 (IGAW 21개 + ADP 16개) → 실제 39개 (IGAW 21 + ADP 18)
//  - templateId: 자동작성용 (변수 placeholder 포함) — autoWrite:false면 빈 문자열
//  - downloadId: 미리보기/다운로드용 (깨끗한 양식)
// ════════════════════════════════════════════════════════════

var CONTRACTS_DATA = [

  // ══════════════════════════════════════════════════════════
  //  IGAW — 자동작성 지원 (8개)
  // ══════════════════════════════════════════════════════════
  {
    id: 'igaw_amendment',
    company: 'IGAW',
    name: '계약 변경 합의서',
    desc: '기 체결 계약 내용 변경에 대한 합의서',
    autoWrite: true,
    templateId: '1wnM5JECnRGl6TxvsHhX5CntfRtrNe3MW8ELQRoW-6SA',
    downloadId: '108Tm2TbZerLV2o7R19TXMQmu2kpZ6TXVMfNFowiSpNI',
    fields: [
    { section: '고객사 정보' },
    { name: 'client_name',    label: '고객사명',       type: 'text', required: true },
    { name: 'client_address', label: '고객사 주소',    type: 'text', required: true, span: 2 },
    { name: 'client_ceo',     label: '고객사 대표이사', type: 'text', required: true },
    { section: '원계약 정보' },
    { name: 'original_contract_name', label: '원계약 계약명', type: 'text', required: true, span: 2, hint: '실제 체결된 계약명과 동일하게 기재하세요.' },
    { name: 'original_contract_date', label: '원계약 체결일', type: 'date', required: true },
    { section: '변경사항' },
    { name: 'change_category', label: '변경 구분',  type: 'text',     required: true, hint: '※ 변경 사항이 1개일 때만 자동작성 가능합니다. 항목이 여러 개인 경우 양식 다운로드 후 직접 작성해주세요.' },
    { name: 'change_before',   label: '변경 전',    type: 'textarea', required: true, span: 2 },
    { name: 'change_after',    label: '변경 후',    type: 'textarea', required: true, span: 2 },
    { section: '합의서 정보' },
    { name: 'sign_date', label: '합의서 체결일', type: 'date', required: true }
  ]
  },
  {
    id: 'igaw_data_supply',
    company: 'IGAW',
    name: '데이터 공급 계약서',
    desc: '데이터 공급에 관한 표준 계약서',
    autoWrite: true,
    templateId: '1-wiMtooymwT_9jH2oAhwpSHwJdt5NmSQbqMq8QCYO78',
    downloadId: '1t1Q0ooDlEIyvPI-p0Ya7RNhZR47kUKwoQOlUkXyDlFk',
    fields: [
      { section: '계약 당사자 정보' },
      { name: 'client_name',       label: '고객사 법인명',       type: 'text',     required: true },
      { name: 'client_ceo',        label: '고객사 대표이사',     type: 'text',     required: true },
      { name: 'client_address',    label: '고객사 주소',         type: 'text',     required: true, span: 2 },
      { name: 'client_biz_number', label: '사업자등록번호',      type: 'text',     required: true },
      { name: 'client_contact',    label: '고객사 담당자',       type: 'text',     required: true },
      { name: 'client_mail',       label: '고객사 이메일',       type: 'text',     required: true },
      { name: 'invoice_email',     label: '계산서 수신 이메일',  type: 'text',     required: true },
    
      { section: '회사 담당자 정보' },
      { name: 'company_name',      label: '회사 담당자',         type: 'text',     required: true },
      { name: 'company_mail',      label: '회사 담당자 이메일',  type: 'text',     required: true },
    
      { section: '계약 조건' },
      { name: 'sign_date',         label: '계약 체결일',         type: 'date',     required: true, span: 2 },
      { name: 'agreement_start',   label: '계약 시작일',         type: 'date',     required: true },
      { name: 'agreement_end',     label: '계약 종료일',         type: 'date',     required: true },
      { name: 'agreement_renew',   label: '계약갱신 조건',       type: 'text',     required: false, span: 2, hint: '예: 자동갱신 1년, 해당사항 없음 등' },
      { name: 'total_fee',         label: '계약금액 (원)', type: 'text',  required: true, format: 'currency', hint: '숫자만 기재하세요' },
    
      { section: '대금 지급' },
      { name: 'invoice_date',      label: '세금계산서 발행일',   type: 'text',     required: true,  hint: '예: 매월 말일, 데이터 공급월 말일 등', defaultValue: '결과물 제출월 말일' },
      { name: 'payment_date',      label: '입금일',              type: 'text',     required: true,  defaultValue: '세금계산서 발행일 기준 익월 말일 이내' },
    
      { section: '데이터 스팩' },
      { name: 'data_spec',         label: '데이터 스팩',         type: 'textarea', required: true,  span: 2, hint: '데이터 처리 목적, 내용, 범위 기재' },
      { name: 'data_supplytime',   label: '공급시기/주기',       type: 'text',     required: true,  hint: '예: 매월 1회, 익월 5영업일 이내' },
    
      { section: '기타' },
      { name: 'special_terms',     label: '기타사항',            type: 'textarea', required: false, span: 2 }
    ]
  },
  {
    id: 'igaw_dfinery_solution',
    company: 'IGAW',
    name: '디파이너리 솔루션 이용 및 대금지급 약정서',
    desc: '디파이너리 솔루션 이용 및 대금 지급에 관한 약정서',
    autoWrite: true,
    templateId: '1WzLCi59d1U3FQwuUEUvzkY4m1AakGAIr3xb72FFyLfs',
    downloadId: '1fGsBFDSmo0sxcYvcLS6IARbGJzEy3fMbOIhaf_feiIU',
    fields: [
      { section: '대행사 정보' },
      { name: 'agency_name',       label: '대행사명',         type: 'text', required: true },
      { name: 'agency_address',    label: '대행사 주소',      type: 'text', required: true, span: 2 },
      { name: 'agency_ceo',        label: '대행사 대표이사',  type: 'text', required: true },
      { name: 'agency_biz_number', label: '사업자등록번호',   type: 'text', required: true },
      { name: 'agency_contact',    label: '담당자',           type: 'text', required: true },
      { name: 'agency_email',      label: '이메일',           type: 'text', required: true },
      { name: 'invoice_email',     label: '계산서 이메일',    type: 'text', required: false },
      { section: '원계약 정보' },
      { name: 'client_name',            label: '회원사명',       type: 'text', required: true },
      { name: 'original_contract_date', label: '원계약 체결일',  type: 'date', required: true },
      { section: '약정 정보' },
      { name: 'sign_date',        label: '약정서 체결일',  type: 'date', required: true, span: 2 },
      { name: 'agreement_start',  label: '약정 시작일',    type: 'date', required: true },
      { name: 'agreement_end',    label: '약정 종료일',    type: 'date', required: true },
      { section: '지급 조건' },
      { name: 'payment_method',   label: '지급방식',       type: 'radio', required: true, options: ['일시납', '분기납', '월분납'] },
      { name: 'payment_detail',   label: '지급조건 상세',  type: 'textarea', required: false, span: 2, hint: '지급방식 선택 시 기본 내용이 채워지며 수정 가능합니다.' },
      { section: '기타' },
      { name: 'special_terms',     label: '특약사항',       type: 'textarea', required: false, span: 2 }
  ]
  },
   {
    id: 'igaw_dfinery_cdp_crm',
    company: 'IGAW',
    name: '디파이너리 이용계약서(CDP,CRM)',
    desc: '디파이너리 CDP,CRM 이용 계약서',
    autoWrite: true,
    templateId: '',
    downloadId: '1NDF7IgsS7o7lIZuNNWfVYGPVX7E2EhAZBMvHE4KCRMk',
    fields: []
  },
  {
    id: 'igaw_subscription',
    company: 'IGAW',
    name: '모바일인덱스 구독 계약서',
    desc: '모바일인덱스 서비스 구독 계약서',
    autoWrite: true,
    templateId: '1EwKYcEfkAyaz5OKcDjPpi4VSfdfzgTvC35vbKNiDnY0',
    downloadId: '1JPTT8P50nZIPSTkPDXGRbphvBgrImGsl_nrjee5NOT0',
    fields: [
      { section: '구매자 정보' },
      { name: 'client_name',       label: '구매자명',         type: 'text', required: true },
      { name: 'client_address',    label: '구매자 주소',      type: 'text', required: true, span: 2 },
      { name: 'client_ceo',        label: '구매자 대표이사',  type: 'text', required: true },
      { name: 'client_biz_number', label: '사업자등록번호',   type: 'text', required: true },
      { section: '계약 기간' },
      { name: 'sign_date',   label: '계약 체결일',     type: 'date', required: true, span: 2 },
      { name: 'start_date',  label: '이용기간 시작일', type: 'date', required: true },
      { name: 'end_date',    label: '이용기간 종료일', type: 'date', required: true },
      { section: '서비스 선택 및 금액' },
      { name: 'services', label: '서비스 선택', type: 'checkbox', required: true, span: 2,
        options: ['사용량 인덱스', '앱 마켓 인덱스', '소비 인덱스', 'TV 애드 인덱스', '모바일인덱스 GAME'] },
      { section: '할인 및 합계' },
      { name: 'fee_6',           label: '최종 할인적용 금액', type: 'text',   required: false, format: 'currency' },
      { name: 'etc_6',           label: '할인 비고',         type: 'text',   required: false },
      { name: 'total_fee',      label: '총 이용료 (원)',    type: 'number', required: true, format: 'currency', hint: '숫자만 기재하세요' },
      { name: 'total_month_fee', label: '월 구독료 (원)',   type: 'number', required: true, format: 'currency', hint: '숫자만 기재하세요' }, 
      { section: '지급 조건' },
      { name: 'payment_method', label: '정산방식', type: 'radio', required: true, options: ['일시납', '분기납', '월분납'] },
      { name: 'payment_detail', label: '지급조건 상세', type: 'textarea', required: false, span: 2, hint: '지급방식 선택 시 기본 내용이 채워지며 수정 가능합니다.' },
      { name: 'invoice_email',  label: '세금계산서 이메일', type: 'text', required: true },
      { section: '기타' },
      { name: 'special_terms', label: '기타사항', type: 'textarea', required: false, span: 2 }
  ]
  },
  {
    id: 'igaw_addendum',
    company: 'IGAW',
    name: '부속 합의서',
    desc: '기 체결 계약에 대한 부속 합의서',
    autoWrite: true,
    templateId: '1tYGPkIX_igH5Zr4u_KJazBogXoNH1Ze25KdyUnruu5k',
    downloadId: '1k_cFLvQSdP8801YYuOSP1W4bNTLDcFiR1D0pTkRNuc4',
    fields: [  
      { section: '고객사 정보' },
      { name: 'client_name',      label: '고객사 법인명',     type: 'text', required: true },
      { name: 'client_address',   label: '고객사 주소',       type: 'text', required: true, span: 2 },
      { name: 'client_ceo',       label: '고객사 대표이사',   type: 'text', required: true },
  
      { section: '원계약 정보' },
      { name: 'original_contract_name', label: '원계약 계약명', type: 'text', required: true, span: 2, hint: '실제 체결된 계약명과 동일하게 기재하세요.' },
      { name: 'original_contract_date', label: '원계약 체결일', type: 'date', required: true },
  
      { section: '합의 내용' },
      { name: 'sign_date',         label: '합의서 체결일',    type: 'date',     required: true },
      { name: 'agreement_detail',  label: '합의사항',         type: 'textarea', required: true, span: 2, hint: '제2조에 들어갈 합의 내용을 기재해 주세요.' }
  ]
  },
  {
    id: 'igaw_service_use_mau',
    company: 'IGAW',
    name: '서비스 이용 계약서_ADB(MAU)',
    desc: 'ADB MAU 서비스 이용 계약서',
    autoWrite: true,
    templateId: '',
    downloadId: '1Hd6MMXYYKbsB3eTcUACOcmenW5MVXUfW2E2x5XT-dQ4',
    fields: []
  },
  {
    id: 'igaw_adbrix_solution',
    company: 'IGAW',
    name: '애드브릭스 솔루션 이용 및 대금지급 약정서',
    desc: '애드브릭스 솔루션 이용 및 대금 지급에 관한 약정서',
    autoWrite: true,
    templateId: '1NbG2pU3Rhu3iXut2r7j71xEoNW4lgDeIrBAba2Pwk2g',
    downloadId: '19N9h77MG8y9v7TKDKxvd6B3VByJA-2iBKlKGOkYzkt0',
    fields: [
      { section: '대행사 정보' },
      { name: 'agency_name',       label: '대행사명',         type: 'text', required: true },
      { name: 'agency_address',    label: '대행사 주소',      type: 'text', required: true, span: 2 },
      { name: 'agency_ceo',        label: '대행사 대표이사',  type: 'text', required: true },
      { name: 'agency_biz_number', label: '사업자등록번호',   type: 'text', required: true },
      { name: 'agency_contact',    label: '담당자',           type: 'text', required: true },
      { name: 'agency_email',      label: '이메일',           type: 'text', required: true },
      { name: 'invoice_email',     label: '계산서 이메일',    type: 'text', required: false },
      { section: '원계약 정보' },
      { name: 'client_name',            label: '회원사명',       type: 'text', required: true },
      { name: 'original_contract_date', label: '원계약 체결일',  type: 'date', required: true },
      { section: '약정 정보' },
      { name: 'sign_date',        label: '약정서 체결일',  type: 'date', required: true, span: 2 },
      { name: 'agreement_start',  label: '약정 시작일',    type: 'date', required: true },
      { name: 'agreement_end',    label: '약정 종료일',    type: 'date', required: true },
      { section: '지급 조건' },
      { name: 'payment_method',   label: '지급방식',       type: 'radio', required: true, options: ['일시납', '분기납', '월분납'] },
      { name: 'payment_detail',   label: '지급조건 상세',  type: 'textarea', required: false, span: 2, hint: '지급방식 선택 시 기본 내용이 채워지며 수정 가능합니다.' },
      { section: '기타' },
      { name: 'special_terms',     label: '특약사항',       type: 'textarea', required: false, span: 2 }
  ]
  },
  {
    id: 'igaw_service',
    company: 'IGAW',
    name: '표준용역위탁계약서',
    desc: '용역 업무 위탁 관련 표준 계약서',
    autoWrite: true,
    templateId: '11HwYhseAmkmdEXrJl8F8-J8srVCLgFJvVN1XEyW3gyY',
    downloadId: '1ml_DWZt4yb60f7vKUufBj45dURliVkh7KZxIwBz9_uE',
    fields: [   
      { section: '수탁자 정보' },
      { name: 'trustee_name',     label: '수탁자 법인명',     type: 'text', required: true },
      { name: 'trustee_address',  label: '수탁자 주소',       type: 'text', required: true, span: 2 },
      { name: 'trustee_ceo',      label: '수탁자 대표이사',   type: 'text', required: true },
  
      { section: '계약 조건' },
      { name: 'contract_date',    label: '계약 체결일',       type: 'date', required: true },
      { name: 'contractName',     label: '계약명',            type: 'text', required: true, span: 2 },
      { name: 'service_cost',     label: '용역대금 (부가세 별도)', type: 'text', required: true, format: 'currency', hint: '숫자만 기재하세요.' },
      { name: 'service_start',    label: '용역 시작일',       type: 'date', required: true },
      { name: 'service_end',      label: '용역 종료일',       type: 'date', required: true },
  
      { section: '대금 지급' },
      { name: 'invoice_date',     label: '세금계산서 발행일', type: 'text', required: true, defaultValue: '용역완료월의 말일' hint: '예: 매월 말일, 별도 협의 등' },
      { name: 'payment_date',     label: '대금지급일',        type: 'text', required: true, defaultValue: '세금계산서 발행일 기준 익월 말일 이내' },
      { name: 'bank_name',        label: '은행명',            type: 'text', required: true },
      { name: 'account_number',   label: '계좌번호',          type: 'text', required: true },
      { name: 'account_holder',   label: '예금주',            type: 'text', required: true },
  
      { section: '수행 업무' },
      { name: 'work_scope',       label: '수행 업무 범위',    type: 'textarea', required: true, span: 2 },
      { name: 'deliverables',     label: '결과물',            type: 'textarea', required: true, span: 2 },
      { name: 'submit_deadline',  label: '제출 기한',         type: 'text', required: false, hint: '예: 용역 종료일까지' },
  
      { section: '기타' },
      { name: 'remarks',          label: '기타사항',          type: 'textarea', required: false, span: 2 }]
  },
  {
    id: 'igaw_tv_index',
    company: 'IGAW',
    name: 'TV INDEX 구독계약서',
    desc: 'TV INDEX 이용에 관한 구독 계약서',
    autoWrite: true,
    templateId: '1zlMHljUYLkCfIjSBItM-Satga0jJpwozWbiQO_Dte_A',
    downloadId: '1p1s9Y3jHngc9Z8KkRdkdGjL1a6EILpEpaH4UPhozOng',
    fields: [
      { section: '구매자 정보' },
      { name: 'client_name',       label: '구매자명',         type: 'text', required: true },
      { name: 'client_address',    label: '구매자 주소',      type: 'text', required: true, span: 2 },
      { name: 'client_ceo',        label: '구매자 대표이사',  type: 'text', required: true },
      { name: 'client_biz_number', label: '사업자등록번호',   type: 'text', required: true },
      { section: '계약 기간' },
      { name: 'sign_date',   label: '계약 체결일',    type: 'date', required: true, span: 2 },
      { name: 'start_date',  label: '이용기간 시작일', type: 'date', required: true },
      { name: 'end_date',    label: '이용기간 종료일', type: 'date', required: true },
      { section: 'TV INDEX 서비스' },
      { name: 'tvindex_fee',     label: 'TV INDEX LITE 금액',  type: 'text', required: true, format: 'currency', hint: '숫자만 기재하세요.'  },
      { name: 'etc_1',           label: 'TV INDEX 비고',       type: 'text', required: false },
      { name: 'account_fee',    label: '계정 추가 금액',       type: 'text', required: false, format: 'currency', hint: '숫자만 기재하세요.'  },
      { name: 'etc_2',           label: '계정 추가 비고',      type: 'text', required: false },
      { name: 'discount_fee',   label: '할인적용 금액',        type: 'text', required: false, format: 'currency', hint: '숫자만 기재하세요.'  },
      { name: 'etc_3',           label: '할인 비고',           type: 'text', required: false },
      { name: 'total_fee',      label: '총 이용료 (원)',       type: 'text', required: true, format: 'currency', hint: '숫자만 기재하세요.'  },
      { name: 'total_month_fee', label: '월 이용료 (원)',      type: 'text', required: true, format: 'currency', hint: '숫자만 기재하세요.'  },
      { section: '이용권한' },
      { name: 'channel',  label: '채널 수량',  type: 'text', required: true },
      { name: 'etc_4',    label: '채널 비고',  type: 'text', required: false },
      { name: 'account',  label: '계정 수량',  type: 'text', required: true },
      { name: 'etc_5',    label: '계정 비고',  type: 'text', required: false },
      { section: '지급 조건' },
      { name: 'payment_method', label: '지급방식', type: 'radio', required: true, options: ['일시납', '분기납', '월분납'] },
      { name: 'payment_detail', label: '지급조건 상세', type: 'textarea', required: false, span: 2, hint: '지급방식 선택 시 기본 내용이 채워지며 수정 가능합니다.' },
      { name: 'invoice_email',  label: '세금계산서 이메일', type: 'text', required: true },
      { section: '기타' },
      { name: 'special_terms', label: '기타사항', type: 'textarea', required: false, span: 2 }
    ]
  },

  // ══════════════════════════════════════════════════════════
  //  IGAW — 양식만 제공
  // ══════════════════════════════════════════════════════════
  {
    id: 'igaw_privacy_trustee',
    company: 'IGAW',
    name: '개인정보 처리업무 위수탁 약정서(수탁자)',
    desc: 'IGAW가 개인정보 처리업무 수탁자인 경우의 업무 약정서',
    autoWrite: false,
    templateId: '',
    downloadId: '1bXIaZwRCxOmjLEX_fqvo6rDJZIsW5bqMuHLo07lx2w0',
    fields: []
  },
  {
    id: 'igaw_dfinery_contract',
    company: 'IGAW',
    name: '디파이너리 이용계약서',
    desc: '디파이너리 이용에 관한 표준 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1dr-uZt55U849X50UlbY2_ZRNVyBFpmMJ09dn39lvsfE',
    fields: []
  },
  {
    id: 'igaw_dfinery_mmp',
    company: 'IGAW',
    name: '디파이너리 이용계약서(MMP 재계약용)',
    desc: '디파이너리 MMP 재계약용 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1q1nRs-LIfpSLts8lJrOuKx37gXA0cv8JcDhzhnmbzMw',
    fields: []
  },
  {
    id: 'igaw_dfinery_application',
    company: 'IGAW',
    name: '디파이너리 이용 신청서',
    desc: '디파이너리 이용 신청서',
    autoWrite: false,
    templateId: '',
    downloadId: '1xEK6F2ixFAmqLIVXBEEk0WrL0jRLSV6o8JQa0_cVhvs',
    fields: []
  },
  {
    id: 'igaw_mi_payment',
    company: 'IGAW',
    name: '모바일인덱스 대금 지급 약정서',
    desc: '모바일인덱스 대금 지급에 관한 약정서',
    autoWrite: false,
    templateId: '',
    downloadId: '1Bl38WSSNPv_A1hKTutcbmmYFWwLYBlzzi4ZHYFu4JfI',
    fields: []
  },
  {
    id: 'igaw_nda',
    company: 'IGAW',
    name: '비밀유지 계약서',
    desc: '비밀정보의 비밀유지 의무 및 기타 제반사항 규정',
    autoWrite: false,
    templateId: '',
    downloadId: '1NEni_ZaeGQH_cs-suNzCttgSNc33opnMWMUz8sR_YPU',
    fields: []
  },
  {
    id: 'igaw_service_use_conversion',
    company: 'IGAW',
    name: '서비스 이용 계약서_ADB(Conversion)',
    desc: 'ADB Conversion 서비스 이용 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1xw9OmMVjxF2ftvs8V0r0v8S_LcMYUcC6oA-mckiRxLA',
    fields: []
  },
  {
    id: 'igaw_guarantee',
    company: 'IGAW',
    name: '연대보증 확약서',
    desc: 'IGAW가 채권자로 채무자, 보증인과 체결하는 연대보증 확약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1eSv-KnNhR-quKul74l-T0GO-ZdvSrI9jqfRTooHjXvI',
    fields: []
  },
  {
    id: 'igaw_advisory',
    company: 'IGAW',
    name: '자문 용역 계약서',
    desc: '자문 용역에 관한 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1KBkRPb6OeGlBv3p93-pKuHdJXXtlGapkccVz32nEg2M',
    fields: []
  },
  {
    id: 'igaw_consulting_service',
    company: 'IGAW',
    name: '컨설팅 용역 계약서',
    desc: '컨설팅 용역에 관한 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1vE2IfZbpZTQ_WdZ_5hTuZkng3eE9PbtIQnqrSo-7bhY',
    fields: []
  },
  {
    id: 'igaw_consulting',
    company: 'IGAW',
    name: '컨설팅용역계약_용역의뢰서',
    desc: '컨설팅용역계약의 개별계약(부속)',
    autoWrite: false,
    templateId: '',
    downloadId: '1WTEr5NARtrqJcHBViFyu4zilxsag7tYPI092Mmx6msM',
    fields: []
  },
  {
    id: 'igaw_service_order',
    company: 'IGAW',
    name: '표준용역위탁계약_용역의뢰서',
    desc: '표준용역위탁계약의 개별계약(부속)',
    autoWrite: false,
    templateId: '',
    downloadId: '1UBYek2E1-8KNDHPtJgC5_49TdffyxB7wPRHd48wg_bY',
    fields: []
  },

  // ══════════════════════════════════════════════════════════
  //  ADP — 자동작성 지원 (10개)
  // ══════════════════════════════════════════════════════════
  {
    id: 'adp_amendment',
    company: 'ADP',
    name: '계약 변경 합의서',
    desc: '기 체결 계약 내용 변경에 대한 합의서',
    autoWrite: true,
    templateId: '1bCKBrFUDHDsgDPM9L5ve8dWKmwA7JLOMkWMCizM3Osw',
    downloadId: '14YH6xzHZ06bKZw0L91AFo91PNKcb2dmY_ASYWTQA1fg',
    fields: []
  },
  {
    id: 'adp_ad',
    company: 'ADP',
    name: '광고계약서',
    desc: '광고 집행 관련 표준 계약서',
    autoWrite: true,
    templateId: '1JZ-64oQc7svIF8eFer3GZrO-72uB1wl2LM5-L50V8rk',
    downloadId: '1jVDZ7TnxU_IwrE4q4C_izhNse_5GQHB5lsFGGnUdzOc',
    fields: []
  },
  {
    id: 'adp_naver_addendum',
    company: 'ADP',
    name: '네이버 애드 매니저 연동에 관한 부속합의서',
    desc: '네이버 애드 매니저 연동 관련 부속합의서',
    autoWrite: true,
    templateId: '1Bf1sYeZ0kioCs611YznZLWpXwopAbD0TktDCDlQOIPY',
    downloadId: '1dg56lqb6WZfiIPUuFkbgPjr-odfANiq2fYOVAiV24Sw',
    fields: []
  },
 {
  id: 'adp_reward_media_partnership',
  company: 'ADP',
  name: '리워드 매체제휴계약서',
  desc: '리워드 매체 제휴 계약서',
  autoWrite: true,
  templateId: '1gXLir1fujESABcFcRgRedei1abCYysOZ5208oUqBNIw',
  downloadId: '1BH5SoSX3dOsp5RuKAy-Jodu7PZHLrBih-EGPVbqcc6U',
  fields: [
    { section: '고객사 정보' },
    { name: 'client_name',       label: '고객사 법인명',      type: 'text',  required: true },
    { name: 'client_address',    label: '고객사 주소',        type: 'text',  required: true, span: 2 },
    { name: 'client_ceo',        label: '고객사 대표이사',    type: 'text',  required: true },
    { name: 'client_BIZ_NUMBER', label: '사업자등록번호',     type: 'text',  required: true },
    { name: 'client_contact',    label: '고객사 담당자',      type: 'text',  required: true },
    { name: 'client_email',      label: '고객사 이메일',      type: 'text',  required: true },
    { name: 'invoice_email',     label: '계산서 이메일',      type: 'text',  required: true },

    { section: '회사 담당자 정보' },
    { name: 'company_contact',       label: '회사 담당자',         type: 'text',  required: true },
    { name: 'company_email',         label: '회사 이메일',         type: 'text',  required: true },
    { name: 'company_invoice_email', label: '회사 계산서 이메일',   type: 'text',  required: true },

    { section: '계약사항' },
    { name: 'sign_date',          label: '계약 체결일',        type: 'date',     required: true, span: 2 },
    { name: 'start_date',         label: '계약기간 시작일',    type: 'date',     required: true },
    { name: 'end_date',           label: '계약기간 종료일',    type: 'date',     required: true },
    { name: 'renewal_terms',      label: '계약갱신 조건',      type: 'textarea', required: false, span: 2, defaultValue: '계약 만료 전 30일 이내에 서면으로 계약갱신 거절의 의사표시 또는 계약 내용의 변경 요구를 하지 아니하면 계약기간 만료일 익일부터 동일한 조건으로 자동적으로 1년씩 갱신된다.' },
    { name: 'invoice_date_terms', label: '세금계산서 발행일',  type: 'text',     required: false, defaultValue: '광고집행월(M월) 말일' },
    { name: 'payment_date_terms', label: '입금일',            type: 'text',     required: false, defaultValue: '세금계산서 발행일 기준 익월(M+1) 말일 이내' },

    { section: '입금계좌정보' },
    { name: 'bank_name',       label: '은행명',    type: 'text', required: true },
    { name: 'account_number',  label: '계좌번호',  type: 'text', required: true },
    { name: 'account_holder',  label: '예금주',    type: 'text', required: true },

    { section: '수익 배분율' },
    { name: 'revenue_company', label: '회사 배분율(%)',   type: 'text', required: true, defaultValue: '30' },
    { name: 'revenue_client',  label: '고객사 배분율(%)', type: 'text', required: true, defaultValue: '70' },

    { section: '기타' },
    { name: 'special_terms', label: '기타사항', type: 'textarea', required: false, span: 2 }
  ]
},
  {
    id: 'adp_reward_plus_addendum',
    company: 'ADP',
    name: '매체제휴부속합의서(보상형광고플러스)',
    desc: '보상형광고플러스 서비스 제공 관련 부속합의서',
    autoWrite: true,
    templateId: '1l85478fmqglJtDMKroIz19I19flnwJNzewzIeISiG4A',
    downloadId: '1bOHEi8t0ngptaTQW7Kpoooay_Gihmy2Ce8gRgin5RCs',
    fields: []
  },
  {
    id: 'adp_addendum',
    company: 'ADP',
    name: '부속 합의서',
    desc: '기 체결 계약에 대한 부속 합의서',
    autoWrite: true,
    templateId: '1ojgc3boZo1a7fFjtit4CO5z9VbqkxiO9nI0MMVp00Mo',
    downloadId: '1PgIdNwTwxGtM-AUbjJGeWxX4vqD-xbCMkF1_29o8jek',
    fields: []
  },
  {
    id: 'adp_popcontent_addendum',
    company: 'ADP',
    name: '팝콘텐츠 제공에 관한 부속합의서',
    desc: '팝콘텐츠 제공 관련 부속 합의서',
    autoWrite: true,
    templateId: '1k8ipDHvSVIX0hP6mgWHZO2sfOn8pkFwBUEnEWEiLgvM',
    downloadId: '16VoLCDujfYNhWooCHH6iIVS5uwBPZ5_UeRja-3Thy9M',
    fields: []
  },
  {
    id: 'adp_service',
    company: 'ADP',
    name: '표준용역위탁계약서',
    desc: '용역 업무 위탁 관련 표준 계약서',
    autoWrite: true,
    templateId: '1JXmqhOy_k2I9IWIiXZpeV0PHAS6JFVWPATS499b3HrM',
    downloadId: '1Gouz2cwZyNvd5v-mwfKHgJRuARplBgkOxODnCNblatg',
    fields: []
  },

  // ══════════════════════════════════════════════════════════
  //  ADP — 양식만 제공 (10개)
  // ══════════════════════════════════════════════════════════
  {
    id: 'adp_privacy_trustee',
    company: 'ADP',
    name: '개인정보 처리업무 위탁 약정서(수탁자)',
    desc: 'ADP가 개인정보 처리업무 수탁자인 경우의 업무 약정서',
    autoWrite: false,
    templateId: '',
    downloadId: '1tnJLewEYfQXVkuR0PkdT4rPR7NJLe-JHTWBxgDVUwsE',
    fields: []
  },
  {
    id: 'adp_privacy_delegator',
    company: 'ADP',
    name: '개인정보 처리업무 위탁 약정서(위탁자)',
    desc: 'ADP가 개인정보 처리업무 위탁자인 경우의 업무 약정서',
    autoWrite: false,
    templateId: '',
    downloadId: '13I7kWt2gbsJPQQr-ERztTMtqDjWroUcJbXoRBr5hhbU',
    fields: []
  },
  {
    id: 'adp_ad_agency',
    company: 'ADP',
    name: '광고계약서P(대행수수료 포함)',
    desc: '광고 집행 관련 표준 계약서(대행수수료 포함)',
    autoWrite: false,
    templateId: '',
    downloadId: '1mb7Vz_PwGKqedwB4MFu5iJ-214B70LWNp8PjsR4MN0g',
    fields: []
  },
  {
    id: 'adp_media_sales',
    company: 'ADP',
    name: '매체영업대행 업무제휴계약서',
    desc: 'ADP 플랫폼의 영업 대행',
    autoWrite: false,
    templateId: '',
    downloadId: '1xJRugFdyKldYSlf6y07B6GSETWYfBtELs1DMJPbriD8',
    fields: []
  },
  {
    id: 'adp_media_partnership',
    company: 'ADP',
    name: '매체제휴계약서',
    desc: '고객사 매체 내 ADP 플랫폼을 통한 광고 집행',
    autoWrite: false,
    templateId: '',
    downloadId: '1YUcw04J1QyMcwys3ysgqZCnmGoCL0trjkm-gvlBRisk',
    fields: []
  },
  {
    id: 'adp_nda',
    company: 'ADP',
    name: '비밀유지 계약서',
    desc: '비밀정보의 비밀유지 의무 및 기타 제반사항 규정',
    autoWrite: false,
    templateId: '',
    downloadId: '1jwgK21IMoJD3mtYBt8jIybeK02CAjXShwSVbembn0k0',
    fields: []
  },
  {
    id: 'adp_business_partnership',
    company: 'ADP',
    name: '업무 제휴 계약서',
    desc: 'ADP 플랫폼을 통한 광고 인벤토리 구매, 집행 제휴',
    autoWrite: false,
    templateId: '',
    downloadId: '1sxOKBqRhRdkocsIOMCszfbJBFCAObJOaTrMqrRnu9Io',
    fields: []
  },
  {
    id: 'adp_guarantee',
    company: 'ADP',
    name: '연대보증 확약서',
    desc: 'ADP가 채권자로 채무자, 보증인과 체결하는 연대보증 확약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1dU0y8OllFyIdf2ccC2zQMaqQCQUp0vfspFRSZFT2BvA',
    fields: []
  },
 {
    id: 'adp_media_integrated',
    company: 'ADP',
    name: '통합매체제휴계약서',
    desc: 'ADP 통합 매체 제휴 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1E019HrNhKpiuaozDQYOfthLHpmnYgB79VMB9OPQBW0Q',
    fields: []
  },
  {
    id: 'adp_service_order',
    company: 'ADP',
    name: '표준용역위탁계약_용역의뢰서',
    desc: '표준용역위탁계약의 개별계약(부속)',
    autoWrite: false,
    templateId: '',
    downloadId: '1e_ethbP39WTWEkEoYoW90VeOBpS8ius0c6t5fcHtoE4',
    fields: []
  },
  {
    id: 'adp_service_agreement_en',
    company: 'ADP',
    name: 'ADPOPCORN SERVICE AGREEMENT',
    desc: 'Adpopcorn Service Agreement (English)',
    autoWrite: false,
    templateId: '',
    downloadId: '1JFu1KjGabsjlhfXg6unbg-EIpZBgNchdebrZ44hsMwU',
    fields: []
  }
];
