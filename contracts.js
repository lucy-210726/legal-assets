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
    fields: []
  },
  {
    id: 'igaw_data_supply',
    company: 'IGAW',
    name: '데이터 공급 계약서',
    desc: '데이터 공급에 관한 표준 계약서',
    autoWrite: true,
    templateId: '1-wiMtooymwT_9jH2oAhwpSHwJdt5NmSQbqMq8QCYO78',
    downloadId: '1t1Q0ooDlEIyvPI-p0Ya7RNhZR47kUKwoQOlUkXyDlFk',
    fields: []
  },
  {
    id: 'igaw_dfinery_solution',
    company: 'IGAW',
    name: '디파이너리 솔루션 이용 및 대금지급 약정서',
    desc: '디파이너리 솔루션 이용 및 대금 지급에 관한 약정서',
    autoWrite: true,
    templateId: '1WzLCi59d1U3FQwuUEUvzkY4m1AakGAIr3xb72FFyLfs',
    downloadId: '1fGsBFDSmo0sxcYvcLS6IARbGJzEy3fMbOIhaf_feiIU',
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
    fields: []
  },
  {
    id: 'igaw_addendum',
    company: 'IGAW',
    name: '부속 합의서',
    desc: '기 체결 계약에 대한 부속 합의서',
    autoWrite: true,
    templateId: '1tYGPkIX_igH5Zr4u_KJazBogXoNH1Ze25KdyUnruu5k',
    downloadId: '1k_cFLvQSdP8801YYuOSP1W4bNTLDcFiR1D0pTkRNuc4',
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
    fields: []
  },
  {
    id: 'igaw_service',
    company: 'IGAW',
    name: '표준용역위탁계약서',
    desc: '용역 업무 위탁 관련 표준 계약서',
    autoWrite: true,
    templateId: '11HwYhseAmkmdEXrJl8F8-J8srVCLgFJvVN1XEyW3gyY',
    downloadId: '1ml_DWZt4yb60f7vKUufBj45dURliVkh7KZxIwBz9_uE',
    fields: []
  },
  {
    id: 'igaw_tv_index',
    company: 'IGAW',
    name: 'TV INDEX 구독계약서',
    desc: 'TV INDEX 이용에 관한 구독 계약서',
    autoWrite: true,
    templateId: '1zlMHljUYLkCfIjSBItM-Satga0jJpwozWbiQO_Dte_A',
    downloadId: '1p1s9Y3jHngc9Z8KkRdkdGjL1a6EILpEpaH4UPhozOng',
    fields: []
  },

  // ══════════════════════════════════════════════════════════
  //  IGAW — 양식만 제공 (13개)
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
    id: 'igaw_dfinery_cdp_crm',
    company: 'IGAW',
    name: '디파이너리 이용계약서(CDP,CRM)',
    desc: '디파이너리 CDP,CRM 이용 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1NDF7IgsS7o7lIZuNNWfVYGPVX7E2EhAZBMvHE4KCRMk',
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
    desc: '비밀유지 계약서',
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
    id: 'igaw_service_use_mau',
    company: 'IGAW',
    name: '서비스 이용 계약서_ADB(MAU)',
    desc: 'ADB MAU 서비스 이용 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1Hd6MMXYYKbsB3eTcUACOcmenW5MVXUfW2E2x5XT-dQ4',
    fields: []
  },
  {
    id: 'igaw_guarantee',
    company: 'IGAW',
    name: '연대보증 확약서',
    desc: '연대보증 확약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1eSv-KnNhR-quKul74l-T0GO-ZdvSrI9jqfRTooHjXvI',
    fields: []
  },
  {
    id: 'igaw_advisory',
    company: 'IGAW',
    name: '자문용역계약서',
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
    name: '컨설팅용역계약서_용역의뢰서',
    desc: '컨설팅용계약서의 개별계약(부속)',
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
    id: 'adp_media_integrated',
    company: 'ADP',
    name: '통합매체제휴계약서',
    desc: 'ADP 통합 매체 제휴 계약서',
    autoWrite: true,
    templateId: '1X2-NNDXsmRY28ysL5j4_mqM8TRS8qA_-RDqHI7bzSuk',
    downloadId: '1E019HrNhKpiuaozDQYOfthLHpmnYgB79VMB9OPQBW0Q',
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
    desc: '매체 영업대행 업무제휴 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1xJRugFdyKldYSlf6y07B6GSETWYfBtELs1DMJPbriD8',
    fields: []
  },
  {
    id: 'adp_media_partnership',
    company: 'ADP',
    name: '매체제휴계약서',
    desc: 'ADP 매체 제휴 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1YUcw04J1QyMcwys3ysgqZCnmGoCL0trjkm-gvlBRisk',
    fields: []
  },
  {
    id: 'adp_nda',
    company: 'ADP',
    name: '비밀유지 계약서',
    desc: '비밀유지 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1jwgK21IMoJD3mtYBt8jIybeK02CAjXShwSVbembn0k0',
    fields: []
  },
  {
    id: 'adp_business_partnership',
    company: 'ADP',
    name: '업무 제휴 계약서',
    desc: '업무 제휴 계약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1sxOKBqRhRdkocsIOMCszfbJBFCAObJOaTrMqrRnu9Io',
    fields: []
  },
  {
    id: 'adp_guarantee',
    company: 'ADP',
    name: '연대보증 확약서',
    desc: '연대보증 확약서',
    autoWrite: false,
    templateId: '',
    downloadId: '1dU0y8OllFyIdf2ccC2zQMaqQCQUp0vfspFRSZFT2BvA',
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
