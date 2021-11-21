import { InterestedCountry } from './interestedcountry';
import { BlackListedGoods } from './blacklistedgoods';
import { BeneInterestedCountry } from './BeneInterestedCountry';

export interface signup {

	 userId:string;
	 subscriberType:string;
	 bankType:string;
	 firstName:string;
	 lastName:string;
	 emailAddress:string;
	 mobileNum:string;
	 landLinenumber:string;
	 countryName:string;
     otherType:string
	 otherTypeBank:string;
	 companyName:string;
	 designation:string;
	 businessType:string;

	 minLCValue:string;
	 regCurrency:string;
	 interestedCountry:InterestedCountry[];
	 blacklistedGoods:BlackListedGoods[];
	 beneInterestedCountry:BeneInterestedCountry[];
	 emailAddress1:string;
	 emailAddress2:string;
	 emailAddress3:string;
}