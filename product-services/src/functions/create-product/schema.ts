export default {
    type: "object",
    required: ["title", "description", "price", "count"],
    properties: {
      title: {
        type: 'string',
        description: 'Product title',
        minLength: 3,
      },
      description: {
        type: 'string',
        description: 'Product description',
      },
      price: {
        type: 'integer',
        description: 'Product price',
        minimum: 1,
      },
      count: {
        type: 'integer',
        description: 'Product count',
        minimum: 1,
      },
      image: {
        type: 'string',
        description: 'Product image',
      },
    },
    additionalProperties: false
  } as const;