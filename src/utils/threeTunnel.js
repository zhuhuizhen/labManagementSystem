// 根据后台传的设备type 返回三维里的设备类型
export function handleDeviceType(type) {
  switch (type) {
    case '110':
      return 'CDZSD'
    case '120':
      return 'SKBXHD'
    case '132':
      return 'SDQBB'
    case '131':
      return 'MJSQBB'
    case '133':
      return 'XBSQBB'
    case '140':
      return 'XSQBB'
    case '150':
      return 'QT'
    case '160':
      return 'WBCJY'
    case '213':
      return 'GGD'
    case '214':
      return 'DG'
    case '215':
      return 'SDD1'
    case '216':
      return 'SDD2'
    case '321':
      return 'SDHJBJP'
    case '410':
      return 'LABA'
    case '420':
      return 'SDNUJDH'
    case '510':
      return 'GDSXJ'
    case '610':
      return 'QYKZQ'
    case '711':
      return 'FENGJI'
    case '712':
      return 'FENGJI'
    default:
  }
}
export function handleDeviceState(type, value) {
  switch (type) {
    case '110':
    // 车道指示灯
      if (value[0] && value[0].devCurState === '1') {
        switch (value[0].laneIndicatorVal) {
          // 正绿正红反绿反红
          case '015':
            return ['7', '9']
          case '014':
            // 正红反绿反红
            return ['3', '9']
          case '013':
            // 正绿反绿反红
            return ['2', '9']
          case '012':
            // 正绿正红反红
            return ['7', '5']
          case '011':
            // 正绿正红反绿
            return ['7', '4']
          case '010':
            // 反绿反红
            return ['6', '9']
          case '009':
            // 正绿正红
            return ['7', '8']
          case '008':
            // 反红
            return ['6', '5']
          case '007':
            // 反绿
            return ['6', '4']
          case '006':
            // 正红
            return ['3', '8']
          case '005':
            // 正绿
            return ['2', '8']
          case '004':
            // 正绿反红
            return ['2', '5']
          case '003':
            // 正红反绿
            return ['3', '4']
          case '002':
            // 正绿反绿
            return ['2', '4']
          case '001':
            // 正红反红
            return ['3', '5']
          default:
            // 默认 正绿反红
            return ['6', '8']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].laneIndicatorVal) {
          case '015':
            return ['7', '9', '0']
          case '014':
            // 正红反绿反红
            return ['3', '9', '0']
          case '013':
            // 正绿反绿反红
            return ['2', '9', '0']
          case '012':
            // 正绿正红反红
            return ['7', '5', '0']
          case '011':
            // 正绿正红反绿
            return ['7', '4', '0']
          case '010':
            // 反绿反红
            return ['6', '9', '0']
          case '009':
            // 正绿正红
            return ['7', '8', '0']
          case '008':
            // 反红
            return ['6', '5', '0']
          case '007':
            // 反绿
            return ['6', '4', '0']
          case '006':
            // 正红
            return ['3', '8', '0']
          case '005':
            // 正绿
            return ['2', '8', '0']
          case '004':
            return ['2', '5', '0']
          case '003':
            return ['3', '4', '0']
          case '002':
            return ['2', '4', '0']
          case '001':
            return ['3', '5', '0']
          default:
            return ['6', '8', '0']
        }
      } else {
        return ['6', '8']
      }
    case '120':
      // 四可变
      var flag = '1'
      if (value[0] && value[0].devCurState === '1') {
        flag = '1'
        flag += value[0].boultLightVal ? '1' : '0'
        flag += value[0].greenLightVal ? '1' : '0'
        flag += value[0].yellowLightVal ? '1' : '0'
        flag += value[0].redLightVal ? '1' : '0'
        return [flag]
      } else if (value[0] && value[0].devCurState === '2') {
        flag = '0'
        flag += value[0].boultLightVal ? '1' : '0'
        flag += value[0].greenLightVal ? '1' : '0'
        flag += value[0].yellowLightVal ? '1' : '0'
        flag += value[0].redLightVal ? '1' : '0'
        return [flag]
      } else {
        return ['1']
      }
    case '132':
      // 隧道内情报板
      if (value[0] && value[0].devCurState === '1') {
        return ['1']
      } else if (value[0] && value[0].devCurState === '2') {
        return ['0']
      } else {
        return ['1']
      }
    case '131':
      // 门架式情报板
      if (value[0] && value[0].devCurState === '1') {
        return ['1']
      } else if (value[0] && value[0].devCurState === '2') {
        return ['0']
      } else {
        return ['1']
      }
    case '133':
      // 悬臂式情报板
      if (value[0] && value[0].devCurState === '1') {
        return ['1']
      } else if (value[0] && value[0].devCurState === '2') {
        return ['0']
      } else {
        return ['1']
      }
    case '140':
      if (value[0] && value[0].devCurState === '1') {
        switch (value[0].itemVal) {
          case '30':
            return ['130']
          case '40':
            return ['140']
          case '50':
            return ['150']
          case '60':
            return ['160']
          case '80':
            return ['180']
          case '100':
            return ['1100']
          case '120':
            return ['1120']
          default:
            return ['100']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].itemVal) {
          case '30':
            return ['130', '0']
          case '40':
            return ['140', '0']
          case '50':
            return ['150', '0']
          case '60':
            return ['160', '0']
          case '80':
            return ['180', '0']
          case '100':
            return ['1100', '0']
          case '120':
            return ['1120', '0']
          default:
            return ['100', '0']
        }
      } else {
        return ['100']
      }
    case '150':
      // 汽通卷帘门
      var sum = 0
      if (value && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].doorCloseState && value[i].doorCloseState === 'true') {
            return ['1', '4']
          }
          if (value[i].doorOpenState && value[i].doorOpenState === 'true') {
            return ['2', '5']
          }
          if (value[i].doorCloseState && value[i].doorCloseState === 'false') {
            sum = sum + 1
          }
          if (value[i].doorOpenState && value[i].doorOpenState === 'false') {
            sum = sum + 1
          }
        }
        if (sum === 2) {
          return ['1', '4', '0']
        } else {
          return ['1', '4']
        }
      } else {
        return ['1', '4']
      }
    case '160':
      return 'WBCJY'
    case '213':
      // 高杆灯
      if (value[0] && (value[0].devCurState === '1' || value[0].devCurState === '3')) {
        switch (value[0].itemVal) {
          case '0':
            return ['2']
          case '1':
            return ['1']
          default:
            return ['2']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].itemVal) {
          case '0':
            return ['2', '0']
          case '1':
            return ['1', '0']
          default:
            return ['2', '0']
        }
      } else {
        return ['2']
      }
    case '214':
      // 洞口灯
      if (value[0] && (value[0].devCurState === '1' || value[0].devCurState === '3')) {
        switch (value[0].itemVal) {
          case '0':
            return ['2']
          case '1':
            return ['1']
          default:
            return ['2']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].itemVal) {
          case '0':
            return ['2', '-1']
          case '1':
            return ['1', '-1']
          default:
            return ['2', '-1']
        }
      } else {
        return ['2']
      }
    case '215':
      // 基础灯组
      if (value[0] && (value[0].devCurState === '1' || value[0].devCurState === '3')) {
        switch (value[0].itemVal) {
          case '0':
            return ['2']
          case '1':
            return ['1']
          default:
            return ['2']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].itemVal) {
          case '0':
            return ['2', '0']
          case '1':
            return ['1', '0']
          default:
            return ['2', '0']
        }
      } else {
        return ['2']
      }
    case '216':
      // 加强灯组
      if (value[0] && (value[0].devCurState === '1' || value[0].devCurState === '3')) {
        switch (value[0].itemVal) {
          case '0':
            return ['2']
          case '1':
            return ['1']
          default:
            return ['2']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].itemVal) {
          case '0':
            return ['2', '0']
          case '1':
            return ['1', '0']
          default:
            return ['2', '0']
        }
      } else {
        return ['2']
      }
    case '321':
      return 'SDHJBJP'
    case '410':
      return 'LABA'
    case '420':
      return 'SDNUJDH'
    case '510':
      return 'GDSXJ'
    case '610':
      return 'QYKZQ'
    case '711':
      if (value[0] && value[0].devCurState === '1') {
        switch (value[0].itemVal) {
          case '0':
            // 停止
            return ['1']
          case '1':
            // 正转
            return ['2']
          case '2':
            // 反转
            return ['3']
          default:
            return ['1']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].itemVal) {
          case '0':
            // 停止
            return ['1', '0']
          case '1':
            // 正转
            return ['2', '0']
          case '2':
            // 反转
            return ['3', '0']
          default:
            return ['1', '0']
        }
      } else {
        return ['1']
      }
    case '712':
      if (value[0] && value[0].devCurState === '1') {
        switch (value[0].itemVal) {
          case '0':
            // 停止
            return ['1']
          case '1':
            // 正转
            return ['2']
          case '2':
            // 反转
            return ['3']
          default:
            return ['1']
        }
      } else if (value[0] && value[0].devCurState === '2') {
        switch (value[0].itemVal) {
          case '0':
            // 停止
            return ['1', '-1']
          case '1':
            // 正转
            return ['2', '-1']
          case '2':
            // 反转
            return ['3', '-1']
          default:
            return ['1', '-1']
        }
      } else {
        return ['0']
      }
    default:
  }
}
