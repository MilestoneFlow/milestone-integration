export const demoFlowsData = [
  {
    _id: { $oid: "666c9afadb15e8d164fd6335" },
    baseUrl: "http://localhost:3001",
    live: true,
    name: "Account flow",
    opts: {
      targeting: {},
      trigger: {},
      themeColor: "#635bff",
      avatarId: "avatar_2",
      elementTemplate: "dark",
      finishEffect: {
        type: "full_screen_animation",
        data: {
          position: "bottomMiddle",
          url: "https://milestone-uploaded-flows-media.s3.amazonaws.com/assets/fireworks_1.gif",
          durationS: 4,
          name: "fireworks_1",
        },
      },
    },
    steps: [
      {
        stepId: "step_17183935940640",
        data: {
          targetUrl: "/dashboard",
          assignedCssElement: ".mui-3dnikv .MuiBox-root > .MuiTypography-root",
          elementType: "popup",
          placement: "bottom",
          blocks: [
            {
              blockId: "block_1718662936178",
              type: "image",
              data: "https://milestone-uploaded-flows-media.s3.amazonaws.com/step_media/8ad5cd8b-9aa7-4799-b2d5-110c5747bae5.gif",
              order: 1,
            },
            {
              blockId: "block_1718393594064",
              type: "text",
              data: "<h2>Welcome to Cashio</h2><p>Discover how to manage your finances, save more, and invest wisely. Let&#39;s get started and complete your first milestone!</p>",
              order: 2,
            },
          ],
          transition: {},
          actionType: "action",
          actionText: "Start",
        },
        opts: {
          isSource: true,
        },
      },
      {
        stepId: "step_17183935940641",
        data: {
          targetUrl: "/dashboard",
          assignedCssElement: ".MuiBox-root .MuiBox-root > .MuiBadge-root",
          elementType: "tooltip",
          placement: "left",
          blocks: [
            {
              blockId: "block_1718393594064",
              type: "text",
              data: "<p>First, set up your account to get a free 1 months unlocked.</p>",
              order: 1,
            },
          ],
          transition: {},
          actionType: "no_action",
          actionText: "Next",
        },
        opts: {},
        parentNodeId: "step_17183935940640",
      },
      {
        stepId: "step_17183935940643",
        data: {
          targetUrl: "/dashboard/settings/account",
          assignedCssElement:
            ".MuiStack-root .MuiCardActions-root > .MuiButtonBase-root:nth-child(2)",
          elementType: "tooltip",
          placement: "bottom",
          blocks: [
            {
              blockId: "block_1718393594064",
              type: "text",
              data: "<p>It&#39;s that easy! Save it to move forward.</p>",
              order: 1,
            },
          ],
          transition: {},
          actionType: "no_action",
          actionText: "Next",
        },
        opts: {
          isFinal: true,
        },
        parentNodeId: "step_17183935940641",
      },
    ],
    workspaceId: "d37530ee-5d65-40bd-9eea-232225a5dc3f",
  },
  {
    _id: { $oid: "666ca503d7c0918fe15eb1e9" },
    baseUrl: "http://localhost:3001",
    live: true,
    name: "Wallet onboarding",
    opts: {
      targeting: {},
      trigger: {},
      themeColor: "#635bff",
      elementTemplate: "dark",
      finishEffect: {},
      dependsOn: ["666c9afadb15e8d164fd6335"],
    },
    steps: [
      {
        stepId: "step_17183961630210",
        data: {
          targetUrl: "/dashboard/settings/{{any}}",
          assignedCssElement: "html > body > div:nth-child(3)",
          elementType: "tooltip",
          placement: "right",
          blocks: [
            {
              blockId: "block_1718396163021",
              type: "text",
              data: "<p>Yay, congrats with your first achievement – now check it out in your wallet!</p>",
              order: 1,
            },
          ],
          transition: {},
          actionType: "no_action",
          actionText: "Next",
        },
        opts: {
          isSource: true,
        },
      },
      {
        stepId: "step_17183961630211",
        data: {
          targetUrl: "/dashboard/settings/{{any}}",
          assignedCssElement: "html > body > div > div > h3:nth-child(2)",
          elementType: "tooltip",
          placement: "right",
          blocks: [
            {
              blockId: "block_1718396163021",
              type: "text",
              data: "<p>Here you can always see your balance.</p>",
              order: 1,
            },
          ],
          transition: {},
          actionType: "action",
          actionText: "Next",
        },
        opts: {},
        parentNodeId: "step_17183961630210",
      },
      {
        stepId: "step_17183961630212",
        data: {
          targetUrl: "/dashboard/settings/{{any}}",
          assignedCssElement: "html h3:nth-child(4)",
          elementType: "tooltip",
          placement: "right",
          blocks: [
            {
              blockId: "block_1718396163021",
              type: "text",
              data: "<p>And unlocked milestones here. Free trial was already activated, enjoy!</p>",
              order: 1,
            },
          ],
          transition: {},
          actionType: "action",
          actionText: "Next",
        },
        opts: {
          isFinal: true,
        },
        parentNodeId: "step_17183961630211",
      },
      {
        stepId: "step_1718397449291",
        data: {
          targetUrl: "/dashboard/settings/{{any}}",
          assignedCssElement:
            ".MuiStack-root > div > .MuiStack-root > .MuiBox-root > .MuiBox-root",
          elementType: "tooltip",
          placement: "right",
          blocks: [
            {
              blockId: "block_1718397449291",
              type: "text",
              data: "<p>Let&#39;s go back to dashboard.</p>",
              order: 1,
            },
          ],
          transition: {},
          actionType: "no_action",
          actionText: "Next",
        },
        opts: {},
        parentNodeId: "step_17183961630212",
      },
    ],
    workspaceId: "d37530ee-5d65-40bd-9eea-232225a5dc3f",
  },
  {
    _id: { $oid: "666c9bb8db15e8d164fd6336" },
    baseUrl: "http://localhost:3001",
    live: true,
    name: "Bank flow",
    opts: {
      targeting: {},
      trigger: {},
      themeColor: "#635bff",
      avatarId: "avatar_2",
      elementTemplate: "dark",
      finishEffect: {},
      dependsOn: ["666ca503d7c0918fe15eb1e9"],
    },
    steps: [
      {
        stepId: "step_17183937846620",
        data: {
          targetUrl: "/dashboard",
          assignedCssElement:
            ".MuiGrid2-root:nth-child(1) .MuiCardHeader-root .MuiTypography-root:nth-child(1)",
          elementType: "popup",
          placement: "bottom",
          blocks: [
            {
              blockId: "block_1718663074351",
              type: "image",
              data: "https://milestone-uploaded-flows-media.s3.amazonaws.com/step_media/49b681ab-d034-415a-bf0c-64bffbee4825.gif",
              order: 1,
            },
            {
              blockId: "block_1718393784662",
              type: "text",
              data: "<p>Let&#39;s make your first transaction – just follow the further steps, and discover all superpowers of <strong>Cashio</strong>.</p>",
              order: 2,
            },
          ],
          transition: {},
          actionType: "action",
          actionText: "Make transaction!",
        },
        opts: {
          isSource: true,
        },
      },
      {
        stepId: "step_17183937846623",
        data: {
          targetUrl: "/dashboard",
          assignedCssElement:
            ".MuiGrid2-root .MuiCardContent-root .MuiButtonBase-root",
          elementType: "tooltip",
          placement: "bottom",
          blocks: [
            {
              blockId: "block_1718393784662",
              type: "text",
              data: "<p>Send it directly from the dashboard.</p>",
              order: 1,
            },
          ],
          transition: {},
          actionType: "no_action",
          actionText: "Next",
        },
        opts: {
          isFinal: true,
        },
        parentNodeId: "step_17183937846620",
      },
    ],
    workspaceId: "d37530ee-5d65-40bd-9eea-232225a5dc3f",
  },
];
