import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
// import { environment } from '@E/environment';

@Injectable({
	providedIn: 'root',
})
export class CryptoService {
	constructor() { }

	// *****The set method is use for encrypt the value*****.
	set(keys: string, value: any): any {
		const key = CryptoJS.enc.Utf8.parse(keys);
		const iv = CryptoJS.enc.Utf8.parse(keys);
		const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key, {
			keySize: 128 / 8,
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});

		return encrypted.toString();
	}

	// *****The get method is use for decrypt the value.*****
	get(keys: string, value: any): any {
		const key = CryptoJS.enc.Utf8.parse(keys);
		const iv = CryptoJS.enc.Utf8.parse(keys);
		const decrypted = CryptoJS.AES.decrypt(value, key, {
			keySize: 128 / 8,
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});

		return decrypted.toString(CryptoJS.enc.Utf8);
	}

	encrytedData(decrytedText: string) {
		//Fix
		//const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
		//const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
		const text = decrytedText.toString();
		// const encryptedMessage = CryptoJS.AES.encrypt(text, key, {
		// 	keySize: 128 / 8,
		// 	iv,
		// 	mode: CryptoJS.mode.CBC,
		// 	padding: CryptoJS.pad.Pkcs7,
		// }).toString();
		// return encryptedMessage;
	}

	decrytedData(encrytedText: string) {
		// const key = CryptoJS.enc.Utf8.parse(environment.AesKey);
		// const iv = CryptoJS.enc.Utf8.parse(environment.AesIV);
		// const text = encrytedText.toString();
		// const decryptedMessage = CryptoJS.AES.decrypt(text, key, {
		// 	keySize: 128 / 8,
		// 	iv,
		// 	mode: CryptoJS.mode.CBC,
		// 	padding: CryptoJS.pad.Pkcs7,
		// }).toString();
		// return decryptedMessage;
	}
}
