import fetch from 'node-fetch';
import https from 'https';
import CryptoJS from 'crypto-js';
// import { createUuid, calcMd5Base64, headersToSign, urlToSign, generateArtemisAuthHeaders } from '../artemis_sign.js';

// Helper functions for encryption
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function encryptPassword(password, salt) {
  const plainPasswordHash = CryptoJS.SHA256(password + salt).toString();
  const secretKey = CryptoJS.SHA256(salt).toString().substring(0, 16);
  const iv = CryptoJS.SHA256(secretKey).toString().substring(0, 16);
  const encrypted = CryptoJS.AES.encrypt(plainPasswordHash, secretKey, { iv: iv }).toString();
  return encrypted;
}

async function testRegister() {
  try {
    console.log('测试注册 API 使用提供的用户数据');

    const userData = {
      username: 'sneakeralex',
      password: 'loveCartest09)!!)',
      email: 'anson_ran@hotmail.com'
    };

    console.log('注册数据:', userData);

    const salt = generateUUID();
    const encryptedPassword = encryptPassword(userData.password, salt);

    const userObject = {
      username: userData.username,
      groupId: 'd1',
      groupAuth: '0',
      remark: '备注',
      expireTime: '2024-12-15T00:00:05.000+08:00',
      password: encryptedPassword,
      salt: salt,
      extendMap: {
        id: '111',
        principalId: '1111',
        principalType: 'USER',
        extFieldKey: 'department',
        extFieldValue: 'huodong',
        tenantIndexCode: '111'
      }
    };

    const response = await fetch('https://cartest.douwifi.cn/artemis/api/manage/auth/v2/manage/userService/saveTripartiteUsers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify([userObject]),
      agent: new https.Agent({ rejectUnauthorized: false })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('注册响应:', result);

    console.log('注册成功！');

  } catch (error) {
    console.error('注册失败:', error.message);
  }
}

// 运行测试
testRegister();
