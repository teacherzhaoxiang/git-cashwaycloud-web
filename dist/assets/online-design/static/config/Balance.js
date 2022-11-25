var queryBalanceFlow = {
    flowName: 'FN_GetELBalnce',
    flows: [
        {
            node: 'ND_Start',
            componentName: 'InitParam',
            params: {
                temp_trans_vtranscode: '100010'
            },
            return: {
                onSuccess: 'ND_WaitAcceptCard',
                onCancel: 'ND_CardOut',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '初始化参数'
        },
        {
            node: 'ND_WaitAcceptCard',
            componentName: 'WaitAcceptCard',
            ui: 'UI_Balance',
            params: {
                serviceName: 'CardReader310',
                ReadData: ['CHIP']
            },
            return: {
                onSuccess: 'ND_ReadingCard',
                magCard: 'ND_ShowEnterPinPage',
                downLevel: 'ND_DownLevelTip',
                onCancel: 'ND_CardOut',
                index: 'ND_PBOCEnd',
                onTimeOver: 'ND_OperateTimeOut',
                onTimeout: 'ND_OperateTimeOut',
                default: 'ND_ReadCardError'
            },
            remark: '读取IC卡信息'
        },
        {
            node: 'ND_ReadingCard',
            componentName: 'ShowMessage',
            params: {
                message: 'trading'
            },
            return: {
                onSuccess: 'ND_PBOCBegin',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
        },
        {
            node: 'ND_PBOCBegin',
            componentName: 'PBOCBegin',
            params: {
                Transtype: '0x05'
            },
            return: {
                onSuccess: 'ND_ImportPin',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '开始PBOC流程'
        },
        {
            node: 'ND_ImportPin',
            componentName: 'PBOCImportPin',
            params: {
                ServiceName: 'CardReader310',
                PinData: ''
            },
            return: {
                onPBOCOnline: 'ND_ReaKernelData',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: ''
        },
        {
            node: 'ND_ReaKernelData',
            componentName: 'PBOCBeforeOnline',
            params: {
                ServiceName: 'CardReader310'
            },
            return: {
                onSuccess: 'ND_ShowEnterPinPage',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '检查读卡器状态'
        },
        {
            node: 'ND_ShowEnterPinPage',
            componentName: 'ShowMessage',
            params: {
                message: 'enterPinNumber'
            },
            return: {
                onSuccess: 'ND_InputPassword',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '展示密码输入界面'
        },
        {
            node: 'ND_InputPassword',
            componentName: 'InputPin',
            params: {
                ServiceName: 'Encryptor310',
                MinKeys: '6',
                MaxKeys: '6',
                CardNo: '',
                AutoEnd: 'false',
            },
            return: {
                onSuccess: 'ND_Trading1',
                index: 'ND_PBOCEnd',
                onCancel: 'ND_CardOut',
                onTimeout: 'ND_InputError',
                onTimeOver: 'ND_OperateTimeOut',
                emptyPass: 'ND_InputPassword',
                default: 'ND_SystemError'
            },
            remark: '密码键盘输入'
        },
        {
            node: 'ND_Trading1',
            componentName: 'ShowMessage',
            params: {
                message: 'trading'
            },
            return: {
                onSuccess: 'ND_GetHardWareSNSync',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '交易中过度界面'
        },
        {
            node: 'ND_GetHardWareSNSync',
            componentName: 'GetHardWareSNSync',
            params: {},
            return: {
                onSuccess: 'ND_Pack59Field',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '交易中过度界面'
        },
        {
            node: 'ND_Pack59Field',
            componentName: 'Pack59Field',
            params: {},
            return: {
                onSuccess: 'ND_IsLzccbCard',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '打包59域组件'
        },
        {
            node: 'ND_IsLzccbCard',
            componentName: 'IsLzccbCard',
            params: {},
            return: {
                lzccb: 'ND_QueryBlackListPre',
                unionPay: 'ND_ConnectPre',
                index: 'ND_PBOCEnd',
                default: 'ND_SystemError'
            },
            remark: '判断是否是本行卡'
        },
        {
            node: 'ND_QueryBlackListPre',
            componentName: 'StartTransFlow',
            params: {},
            return: {
                onSuccess: 'ND_QueryBlackList',
                index: 'ND_PBOCEnd',
                default: 'ND_QueryBlackList'
            },
            remark: '开始交易'
        },
        {
            node: 'ND_QueryBlackList',
            componentName: 'MessageComm',
            params: {
                url: '/tx/ZZ0409',
                msgId: 'ZZ0409',
                timeout: 60000,
                saveMsgIDKey: 'temp_trans_trancode',
                states: {
                    packFail: '',
                    connectFail: '',
                    sendFail: '',
                    receiveFail: '',
                    receiveTimeout: '',
                    networkFail: '',
                    unpackFail: ''
                }
            },
            return: {
                onSuccess: 'ND_QueryBlackListResp',
                onPackFail: 'ND_SystemError',
                onUnpackFail: 'ND_SystemError',
                onReceiveTimeout: 'ND_InterfaceTimeOut',
                default: 'ND_SystemError'
            },
            remark: '调用黑名单查询接口'
        },
        {
            node: 'ND_QueryBlackListResp',
            componentName: 'MessageResp',
            params: {},
            return: {
                onSuccess: 'ND_ConnectPre',
                default: 'ND_CommonMessageError'
            },
            remark: '调用黑名单接口响应'
        },
        {
            node: 'ND_ConnectPre',
            componentName: 'StartTransFlow',
            params: {},
            return: {
                onSuccess: 'ND_Connect',
                index: 'ND_PBOCEnd',
                default: 'ND_Connect'
            },
            remark: '开始交易'
        },
        {
            node: 'ND_Connect',
            componentName: 'MessageComm',
            params: {
                url: '/tx/ZZ0803',
                msgId: 'ZZ0803',
                timeout: 60000,
                saveMsgIDKey: 'temp_trans_trancode',
                states: {
                    packFail: '',
                    connectFail: '',
                    sendFail: '',
                    receiveFail: '',
                    receiveTimeout: '',
                    networkFail: '',
                    unpackFail: ''
                }
            },
            return: {
                onSuccess: 'ND_ConnectResp',
                onPackFail: 'ND_SystemError',
                onUnpackFail: 'ND_SystemError',
                onReceiveTimeout: 'ND_InterfaceTimeOut',
                default: 'ND_SystemError'
            },
            remark: '调用后端余额查询接口'
        },
        {
            node: 'ND_ConnectResp',
            componentName: 'MessageResp',
            params: {
                isOver: 1
            },
            return: {
                onSuccess: 'ND_showBalance',
                reInput: 'ND_PasssErrorPage',
                default: 'ND_CommonMessageError'
            },
            remark: '调用后端余额响应'
        },
        {
            node: 'ND_PasssErrorPage',
            componentName: 'ShowMessageWait',
            params: {
                message: 'passErrorPage'
            },
            return: {
                default: 'ND_ShowEnterPinPage'
            }
        },
        {
            node: 'ND_showBalance',
            componentName: 'ShowMessageWait',
            // ui:'UI_Balance_Show',
            params: {
                message: 'balanceShow'
            },
            return: {
                onCancel: 'ND_CardOut',
                index: 'ND_PBOCEnd',
                onTimeOver: 'ND_OperateTimeOut',
                default: 'ND_SystemError'
            },
            remark: '展示余额页面'
        },
        {
            node: 'ND_PBOCEnd',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CardOut',
                nodeName: 'ND_CardExitTrading'
            },
            return: {},
            remark: '进入退卡流程'
        },
        {
            node: 'ND_CardOut',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CardOut',
                nodeName: 'ND_Start'
            },
            return: {},
            remark: '进入退卡流程'
        },
        {
            node: 'ND_ReadCardError',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_ReadCardError'
            },
            return: {}
        },
        {
            node: 'ND_SystemError',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_SystemError'
            },
            return: {}
        },
        {
            node: 'ND_CommonMessageError',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_CommonMessageError'
            },
            return: {}
        },
        {
            node: 'ND_InputError',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_InputError'
            },
            return: {}
        },
        {
            node: 'ND_OperateTimeOut',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_OperateTimeOut'
            },
            return: {}
        },
        {
            node: 'ND_TransactionReqTimeout',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_TransactionReqTimeout'
            },
            return: {}
        },
        {
            node: 'ND_InterfaceTimeOut',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_InterfaceTimeOut'
            },
            return: {}
        },
        {
            node: 'ND_DownLevelTip',
            componentName: 'jumpFlow',
            params: {
                flowName: 'FN_CommonWarn',
                nodeName: 'ND_DownLevelTip'
            },
            return: {}
        }
    ]
};
export default queryBalanceFlow;
