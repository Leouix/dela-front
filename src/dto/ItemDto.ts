export interface ItemDto {
    id: number | string
    type: string
    title: string
    text: string
    cost: number | null
    created_at: string
    deadline: string | null
    is_partner: boolean
    company_name: string
}
