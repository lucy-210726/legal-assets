// ════════════════════════════════════════════════════════════
//  IGAW 법무 원스톱 센터 — 계약서 유형 정의
//  GitHub CDN으로 관리: https://lucy-210726.github.io/legal-assets/contracts.js
//
//  양식 추가/수정 시 이 파일만 수정하면 됩니다.
//  Code.gs의 getContracts() 함수는 더 이상 사용하지 않습니다.
// ════════════════════════════════════════════════════════════

// ═══════════════════════════════════════
//  [IGAW]
//  service              _ 용역위탁계약서
//  addendum             _ 부속 합의서
//  subscription         _ 모바일인덱스 구독계약서
//  service_use          _ 서비스 이용 계약서(ADB_MAU)
//  amendment            _ 계약 변경 합의서
//  dfinery              _ 디파이너리 이용 계약서
//  tv_index             _ TV INDEX 구독 계약서

//
//  [ADP]
//  ad                   _ 광고 계약서
//  media                _ 통합매체계약서
//  reward               _ 리워드매체계약서
//
//  [FIXTYPE]
//  fixtype_service      _ 용역계약서
//  fixtype_service_req  _ 용역계약서_용역의뢰서
//  fixtype_folio        _ FIXFOLIO 서비스 이용 신청서
// ═══════════════════════════════════════

var CONTRACTS_DATA = [

  // ──────────────────────────────────────
  //  IGAW
  // ──────────────────────────────────────
  {
    id: 'subscription',
    company: 'IGAW',
    name: '모바일인덱스 구독계약서',
    desc: '모바일인덱스 서비스 구독 계약서',
    templateId: '1kzAJARW3b2UjZJagCnUn_TWZwLhJNmDD',
    downloadId: '1kzAJARW3b2UjZJagCnUn_TWZwLhJNmDD',
    fields: [
      { section: '구매자 정보' },
      { name: 'buyer_name',      label: '구매자명',       type: 'text', required: true },
      { name: 'buyer_address',   label: '구매자 주소',    type: 'text', required: true, span: 2 },
      { name: 'buyer_ceo',       label: '구매자 대표이사', type: 'text', required: true },
      { name: 'business_number', label: '사업자등록번호',  type: 'text', required: true },
      { section: '계약 기간' },
      { name: 'contract_date', label: '계약체결일',     type: 'date',  required: true },
      { name: 'service_start', label: '이용기간 시작일', type: 'date',  required: true },
      { name: 'service_end',   label: '이용기간 종료일', type: 'date',  required: true },
      { name: 'auto_renewal',  label: '자동갱신',       type: 'radio', required: true, options: ['동의함', '동의하지 않음'] },
      { section: '서비스 및 금액' },
      { name: 'services',    label: '서비스 선택',      type: 'checkbox', required: true, span: 2, options: ['사용량 인덱스 (앱 사용량 데이터 분석)', '앱 마켓 인덱스 (마켓정보, 마켓 매출 데이터 분석)', '소비 인덱스 (카드 결제 데이터 분석)'] },
      { name: 'total_amount', label: '총 계약금액 (원)', type: 'number', required: true },
      { name: 'monthly_fee',  label: '월 구독료 (원)',   type: 'number', required: true }
    ]
  },

  {
    id: 'service_use',
    company: 'IGAW',
    name: '서비스 이용 계약서(ADB_MAU)',
    desc: 'IGAW 서비스 이용에 관한 표준 계약서',
    templateId: '1ougKohxhx-HKjcfUxLjr26giKA1hX9Qs',
    downloadId: '1ougKohxhx-HKjcfUxLjr26giKA1hX9Qs',
    fields: [
      { section: '이용자 정보' },
      { name: 'client_name',     label: '이용자(갑)명',    type: 'text', required: true },
      { name: 'client_address',  label: '이용자 주소',     type: 'text', required: true, span: 2 },
      { name: 'client_ceo',      label: '이용자 대표이사', type: 'text', required: true },
      { name: 'business_number', label: '사업자등록번호',   type: 'text', required: true },
      { section: '계약 정보' },
      { name: 'contract_date', label: '계약체결일',    type: 'date', required: true },
      { name: 'service_name',  label: '서비스명',      type: 'text', required: true, span: 2 },
      { name: 'service_start', label: '서비스 시작일', type: 'date', required: true },
      { name: 'service_end',   label: '서비스 종료일', type: 'date', required: true },
      { section: '요금 및 결제' },
      { name: 'contract_amount', label: '계약금액 (원)', type: 'number', required: true },
      { name: 'payment_method',  label: '결제 방식',     type: 'text',   required: false, hint: '예: 월납, 선납 등' },
      { section: '서비스 범위' },
      { name: 'service_scope', label: '서비스 제공 범위', type: 'textarea', required: true,  span: 2 },
      { name: 'remarks',       label: '기타사항',        type: 'textarea', required: false, span: 2 }
    ]
  },
  { id: 'dfinery',  
    company: 'IGAW',
    name: '디파이너리 이용 계약서',
    desc: '디파이너리 이용에 관한 표준 계약서',
    templateId: '1WmnE_Tk-vHbi08Y0yyi5wqgSwIwqdWJD',
    downloadId: '1WmnE_Tk-vHbi08Y0yyi5wqgSwIwqdWJD',
    fields: [] 
  },
  { id: 'tv_index',  
    company: 'IGAW',
    name: 'TV INDEX 구독 계약서',
    desc: 'TV INDEX 이용에 관한 표준 계약서',
    templateId: '1U9SsxSetrXYtkpH0Xv2B9k7QnVYJ2mnN',
    downloadId: '1U9SsxSetrXYtkpH0Xv2B9k7QnVYJ2mnN',
    fields: [] 
  },
   {
    id: 'service',
    company: 'IGAW',
    name: '용역위탁계약서',
    desc: '용역 업무 위탁 관련 표준 계약서',
    templateId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    downloadId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    fields: [
      { section: '수탁자 정보' },
      { name: 'trustee_name',    label: '수탁자명',       type: 'text', required: true },
      { name: 'trustee_address', label: '수탁자 주소',    type: 'text', required: true, span: 2 },
      { name: 'trustee_ceo',     label: '수탁자 대표이사', type: 'text', required: true },
      { section: '계약 기본 정보' },
      { name: 'contract_date',  label: '계약체결일',        type: 'date',   required: true },
      { name: 'contract_name',  label: '계약명',            type: 'text',   required: true, span: 2 },
      { name: 'service_cost',   label: '용역대금 (원)',     type: 'number', required: true },
      { name: 'service_start',  label: '용역기간 시작일',   type: 'date',   required: true },
      { name: 'service_end',    label: '용역기간 종료일',   type: 'date',   required: true },
      { section: '결제 정보' },
      { name: 'invoice_date',   label: '세금계산서 발행일', type: 'text', required: false, hint: '기본값: 용역 완료 월의 말일' },
      { name: 'payment_date',   label: '대금지급일',        type: 'text', required: false, hint: '기본값: 세금계산서 발행일 기준 익월 말일 이내' },
      { name: 'bank_name',      label: '은행명',            type: 'text', required: false },
      { name: 'account_number', label: '계좌번호',          type: 'text', required: false },
      { name: 'account_holder', label: '예금주',            type: 'text', required: false },
      { section: '업무 범위 및 결과물' },
      { name: 'work_scope',       label: '수행 업무 범위',    type: 'textarea', required: true,  span: 2 },
      { name: 'deliverables',     label: '결과물',            type: 'textarea', required: true,  span: 2 },
      { name: 'submit_deadline',  label: '제출기한',          type: 'text',     required: false },
      { name: 'remarks',          label: '기타사항 (특약)',   type: 'textarea', required: false, span: 2 }
    ]
  },
  {
    id: 'addendum',
    company: 'IGAW',
    name: '부속 합의서',
    desc: '기 체결 계약에 대한 부속 합의서',
    templateId: '1BcUP2kmiTHysIwy0Bk40U3sr38JO7_hP',
    downloadId: '1BcUP2kmiTHysIwy0Bk40U3sr38JO7_hP',
    fields: [
      { section: '고객사 정보' },
      { name: 'client_name',    label: '고객사명',       type: 'text', required: true },
      { name: 'client_address', label: '고객사 주소',    type: 'text', required: true, span: 2 },
      { name: 'client_ceo',     label: '고객사 대표이사', type: 'text', required: true },
      { section: '원계약 정보' },
      { name: 'original_contract_name', label: '원계약 계약명', type: 'text', required: true, span: 2 },
      { name: 'original_contract_date', label: '원계약 체결일', type: 'date', required: true },
      { section: '합의 내용' },
      { name: 'agreement_detail', label: '합의사항', type: 'textarea', required: true, span: 2 },
      { section: '합의서 정보' },
      { name: 'SIGN_DATE', label: '합의서 체결일', type: 'date', required: true }
    ]
  },
  { id: 'amendment',  
    company: 'IGAW',
    name: '계약 변경 합의서',
    desc: '기 체결 계약 내용 변경에 대한 합의서',
    templateId: '129Z3rApRkUehxs46GWHU71iYpkRDhszX',
    downloadId: '129Z3rApRkUehxs46GWHU71iYpkRDhszX',
    fields: [] 
  }

  // ──────────────────────────────────────
  //  ADP
  // ──────────────────────────────────────
  {
    id: 'ad',
    company: 'ADP',
    name: '광고 계약서',
    desc: 'ADP 광고 집행 관련 표준 계약서',
    templateId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    downloadId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    fields: [
      { section: '광고주 정보' },
      { name: 'advertiser_name',    label: '광고주명',       type: 'text', required: true },
      { name: 'advertiser_address', label: '광고주 주소',    type: 'text', required: true, span: 2 },
      { name: 'advertiser_ceo',     label: '광고주 대표이사', type: 'text', required: true },
      { name: 'business_number',    label: '사업자등록번호',  type: 'text', required: true },
      { section: '광고 계약 내용' },
      { name: 'contract_date', label: '계약체결일',        type: 'date',   required: true },
      { name: 'campaign_name', label: '캠페인명',          type: 'text',   required: true, span: 2 },
      { name: 'ad_start',      label: '광고 집행 시작일',  type: 'date',   required: true },
      { name: 'ad_end',        label: '광고 집행 종료일',  type: 'date',   required: true },
      { name: 'ad_budget',     label: '광고 집행 금액 (원)', type: 'number', required: true },
      { section: '광고 상세' },
      { name: 'ad_type',     label: '광고 유형',    type: 'text',     required: true, hint: '예: CPI, CPA, CPM 등' },
      { name: 'target_kpi',  label: '목표 KPI',     type: 'text',     required: false },
      { name: 'ad_platform', label: '집행 플랫폼',  type: 'textarea', required: true,  span: 2 },
      { name: 'remarks',     label: '특약사항',     type: 'textarea', required: false, span: 2 }
    ]
  },

  {
    id: 'media',
    company: 'ADP',
    name: '통합매체계약서',
    desc: 'ADP 통합 매체 운영 계약서',
    templateId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    downloadId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    fields: [
      { section: '매체사 정보' },
      { name: 'media_name',      label: '매체사명',       type: 'text', required: true },
      { name: 'media_address',   label: '매체사 주소',    type: 'text', required: true, span: 2 },
      { name: 'media_ceo',       label: '매체사 대표이사', type: 'text', required: true },
      { name: 'business_number', label: '사업자등록번호',  type: 'text', required: true },
      { section: '계약 내용' },
      { name: 'contract_date', label: '계약체결일',       type: 'date',   required: true },
      { name: 'media_start',   label: '계약 시작일',      type: 'date',   required: true },
      { name: 'media_end',     label: '계약 종료일',      type: 'date',   required: true },
      { name: 'revenue_share', label: '수익 배분율 (%)',  type: 'number', required: true },
      { section: '매체 정보' },
      { name: 'app_name',     label: '앱/서비스명',    type: 'text',     required: true },
      { name: 'app_category', label: '카테고리',       type: 'text',     required: false, hint: '예: 게임, 쇼핑, 유틸리티 등' },
      { name: 'media_scope',  label: '매체 운영 범위', type: 'textarea', required: true,  span: 2 },
      { name: 'remarks',      label: '특약사항',       type: 'textarea', required: false, span: 2 }
    ]
  },

  {
    id: 'reward',
    company: 'ADP',
    name: '리워드매체계약서',
    desc: 'ADP 리워드 광고 매체 계약서',
    templateId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    downloadId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    fields: [
      { section: '매체사 정보' },
      { name: 'media_name',      label: '매체사명',       type: 'text', required: true },
      { name: 'media_address',   label: '매체사 주소',    type: 'text', required: true, span: 2 },
      { name: 'media_ceo',       label: '매체사 대표이사', type: 'text', required: true },
      { name: 'business_number', label: '사업자등록번호',  type: 'text', required: true },
      { section: '리워드 계약 내용' },
      { name: 'contract_date', label: '계약체결일',      type: 'date',   required: true },
      { name: 'reward_start',  label: '계약 시작일',     type: 'date',   required: true },
      { name: 'reward_end',    label: '계약 종료일',     type: 'date',   required: true },
      { name: 'reward_type',   label: '리워드 유형',     type: 'text',   required: true, hint: '예: 포인트, 캐시, 쿠폰 등' },
      { name: 'cpa_rate',      label: 'CPA 단가 (원)',   type: 'number', required: true },
      { section: '운영 상세' },
      { name: 'reward_scope',     label: '리워드 광고 운영 범위', type: 'textarea', required: true,  span: 2 },
      { name: 'settlement_cycle', label: '정산 주기',             type: 'text',     required: false, hint: '예: 월 1회, 격주 등' },
      { name: 'remarks',          label: '특약사항',              type: 'textarea', required: false, span: 2 }
    ]
  },

  // ──────────────────────────────────────
  //  FIXTYPE
  // ──────────────────────────────────────
  { id: 'fixtype_service',  
    company: 'FIXTYPE',
    name: '용역계약서',
    desc: 'FIXTYPE 용역 표준 계약서',
    templateId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    downloadId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    fields: [] 
  },
  
  { id: 'fixtype_service_req', 
    company: 'FIXTYPE',
    name: '용역계약서_용역의뢰서',
    desc: 'FIXTYPE 기 체결 용역 계약에 대한 부속 합의서',
    templateId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    downloadId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    fields: [] 
  },
  
  { id: 'fixtype_folio',
    company: 'FIXTYPE',
    name: 'FIXFOLIO 서비스 이용 신청서',
    desc: 'FIXFOLIO 서비스 이용 신청서',
    templateId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
    downloadId: '12Qk_mclOvrhs4x-6v5mjnKzonrFVIGBZ',
   fields: [] 
  }
];
