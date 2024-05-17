export const encode = (data: any) => JSON.stringify(data)
export const decode = (data: string | null) => (data ? JSON.parse(data) : null)
