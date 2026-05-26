import type Anthropic from '@anthropic-ai/sdk';

export const TRIP_PLAN_TOOL_NAME = 'create_trip_plan';

export const tripPlanTool: Anthropic.Tool = {
  name: TRIP_PLAN_TOOL_NAME,
  description: '產生一份台灣微旅行行程',
  input_schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: '行程標題，例如「淡水半日甜點散策」',
      },
      summary: {
        type: 'string',
        description: '一句話摘要，不超過 40 字',
      },
      estimatedCost: {
        type: 'integer',
        description: '單人總預估花費，整數元為單位',
      },
      targetAudience: {
        type: 'array',
        items: { type: 'string' },
        description: '適合對象標籤，2-3 個，例如「情侶」「文青」「不想開車的台北人」',
      },
      stops: {
        type: 'array',
        minItems: 3,
        maxItems: 5,
        items: {
          type: 'object',
          properties: {
            startTime: {
              type: 'string',
              description: '開始時間，格式 HH:MM (24 小時制)',
            },
            endTime: {
              type: 'string',
              description: '結束時間，格式 HH:MM',
            },
            placeName: {
              type: 'string',
              description: '真實存在的台灣景點 / 店家名稱，不要編造',
            },
            city: {
              type: 'string',
              description: '所在縣市 / 區，例如「新北淡水」「台北大安」',
            },
            description: {
              type: 'string',
              description: '這站在做什麼，2-3 句話，口語',
            },
            transportNote: {
              type: 'string',
              description: '如何從上一站到這裡，含交通工具和時間',
            },
            estimatedCost: {
              type: 'integer',
              description: '這站單人花費，整數元 (含門票、餐費、交通)',
            },
          },
          required: [
            'startTime',
            'endTime',
            'placeName',
            'city',
            'description',
            'transportNote',
            'estimatedCost',
          ],
        },
      },
      rainyDayBackup: {
        type: 'string',
        description: '如果當天下雨的備案，1-2 句話',
      },
      socialCaption: {
        type: 'string',
        description:
          'IG / Threads 貼文文案，1-2 句、口語、可帶 1 個 emoji，不要硬加 hashtag',
      },
    },
    required: [
      'title',
      'summary',
      'estimatedCost',
      'targetAudience',
      'stops',
      'rainyDayBackup',
      'socialCaption',
    ],
  },
};
