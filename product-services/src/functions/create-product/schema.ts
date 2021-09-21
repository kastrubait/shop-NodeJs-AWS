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
      type: 'number',
      description: 'Product price',
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