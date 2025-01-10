export enum TokenStatus {
    BillReceived = 1,
    ForwardedByDealingAssistant = 2,
    ObjectedByDealingAssistant = 3,
    ForwardedByAccountant = 4,
    ObjectedByAccountant = 5,
    ForwardedByTreasuryOfficer = 6,
    ObjectedByTreasuryOfficer = 7,
    BillClear = 8,
    ReturnMemoGenerated = 9,
}
export enum TokenStatusSlug {
    BillReceived = 'bill_received',
    ForwardedByDealingAssistant = 'da_froward',
    ObjectedByDealingAssistant = 'da_objected',
    ForwardedByAccountant = 'ac_froward',
    ObjectedByAccountant = 'ac_objected',
    ForwardedByTreasuryOfficer = 'to_froward',
    ObjectedByTreasuryOfficer = 'to_objected',
    BillClear = 'bill_clear',
    ReturnMemoGenerated = 'retrun_memo_generated',
}
export enum StatusType {
    BillChecking = 1,
    ReturnMemo = 2,
}
