export interface SwaggerDefinition {
  openapi: string
  info: {
    title: string
    version: string
    description: string
    contact?: {
      name: string
      email: string
    }
    license?: {
      name: string
      url: string
    }
  }
  servers: Array<{
    url: string
    description: string
  }>
  components: {
    schemas: Record<string, any>
    securitySchemes: Record<string, any>
    responses?: Record<string, any>
  }
  tags: Array<{
    name: string
    description: string
  }>
  paths: Record<string, any>
}