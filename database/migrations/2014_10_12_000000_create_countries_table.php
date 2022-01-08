<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCountriesTable extends Migration
{
    private $data = [
        [
            'phone_code'    =>  '+93',
            'name'          =>  'Afghanistan'
        ],
        [
            'phone_code'    =>  '+355',
            'name'          =>  'Albania'
        ],
        [
            'phone_code'    =>  '+213',
            'name'          =>  'Algeria'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'American Samoa'
        ],
        [
            'phone_code'    =>  '+244',
            'name'          =>  'Andorra'
        ],
        [
            'phone_code'    =>  '+355',
            'name'          =>  'Angola'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Anguilla'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Antigua'
        ],
        [
            'phone_code'    =>  '+54',
            'name'          =>  'Argentina'
        ],
        [
            'phone_code'    =>  '+374',
            'name'          =>  'Armenia'
        ],
        [
            'phone_code'    =>  '+297',
            'name'          =>  'Aruba'
        ],
        [
            'phone_code'    =>  '+61',
            'name'          =>  'Australia'
        ],
        [
            'phone_code'    =>  '+43',
            'name'          =>  'Austria'
        ],
        [
            'phone_code'    =>  '+994',
            'name'          =>  'Azerbaijan'
        ],
        [
            'phone_code'    =>  '+973',
            'name'          =>  'Bahrain'
        ],
        [
            'phone_code'    =>  '+880',
            'name'          =>  'Bangladesh'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Barbados'
        ],
        [
            'phone_code'    =>  '+375',
            'name'          =>  'Belarus'
        ],
        [
            'phone_code'    =>  '+32',
            'name'          =>  'Belgium'
        ],
        [
            'phone_code'    =>  '+501',
            'name'          =>  'Belize'
        ],
        [
            'phone_code'    =>  '+229',
            'name'          =>  'Benin'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Bermuda'
        ],
        [
            'phone_code'    =>  '+975',
            'name'          =>  'Bhutan'
        ],
        [
            'phone_code'    =>  '+591',
            'name'          =>  'Bolivia'
        ],
        [
            'phone_code'    =>  '+599',
            'name'          =>  'AlbaniaBonaire, Sint Eustatius and Saba'
        ],
        [
            'phone_code'    =>  '+387',
            'name'          =>  'Bosnia and Herzegovina'
        ],
        [
            'phone_code'    =>  '+267',
            'name'          =>  'Botswana'
        ],
        [
            'phone_code'    =>  '+55',
            'name'          =>  'Brazil'
        ],
        [
            'phone_code'    =>  '+246',
            'name'          =>  'British Indian Ocean Territory'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'British Virgin Islands'
        ],
        [
            'phone_code'    =>  '+673',
            'name'          =>  'Brunei'
        ],
        [
            'phone_code'    =>  '+359',
            'name'          =>  'Bulgaria'
        ],
        [
            'phone_code'    =>  '+226',
            'name'          =>  'Burkina'
        ],
        [
            'phone_code'    =>  '+257',
            'name'          =>  'Burundi'
        ],
        [
            'phone_code'    =>  '+855',
            'name'          =>  'Cambodia'
        ],
        [
            'phone_code'    =>  '+237',
            'name'          =>  'Cameroon'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Canada'
        ],
        [
            'phone_code'    =>  '+238',
            'name'          =>  'Cape Verde'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Cayman Islands'
        ],
        [
            'phone_code'    =>  '+236',
            'name'          =>  'Central African Republic'
        ],
        [
            'phone_code'    =>  '+235',
            'name'          =>  'Chad'
        ],
        [
            'phone_code'    =>  '+56',
            'name'          =>  'Chile'
        ],
        [
            'phone_code'    =>  '+86',
            'name'          =>  'China'
        ],
        [
            'phone_code'    =>  '+57',
            'name'          =>  'Colombia'
        ],
        [
            'phone_code'    =>  '+269',
            'name'          =>  'Comoros'
        ],
        [
            'phone_code'    =>  '+682',
            'name'          =>  'Cook Islands'
        ],
        [
            'phone_code'    =>  '+506',
            'name'          =>  'Costa Rica'
        ],
        [
            'phone_code'    =>  '+225',
            'name'          =>  'Côte d\'Ivoire'
        ],
        [
            'phone_code'    =>  '+385',
            'name'          =>  'Croatia'
        ],
        [
            'phone_code'    =>  '+53',
            'name'          =>  'Cuba'
        ],
        [
            'phone_code'    =>  '+599',
            'name'          =>  'Curaçao'
        ],
        [
            'phone_code'    =>  '+357',
            'name'          =>  'Cyprus'
        ],
        [
            'phone_code'    =>  '+420',
            'name'          =>  'Czech Republic'
        ],
        [
            'phone_code'    =>  '+243',
            'name'          =>  'Democratic Republic of the Congo'
        ],
        [
            'phone_code'    =>  '+45',
            'name'          =>  'Denmark'
        ],
        [
            'phone_code'    =>  '+253',
            'name'          =>  'Djibouti'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Dominica'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Dominican Republic'
        ],
        [
            'phone_code'    =>  '+593',
            'name'          =>  'Ecuador'
        ],
        [
            'phone_code'    =>  '+20',
            'name'          =>  'Egypt'
        ],
        [
            'phone_code'    =>  '+503',
            'name'          =>  'El Salvador'
        ],
        [
            'phone_code'    =>  '+240',
            'name'          =>  'Equatorial Guinea'
        ],
        [
            'phone_code'    =>  '+291',
            'name'          =>  'Eritrea'
        ],
        [
            'phone_code'    =>  '+372',
            'name'          =>  'Estonia'
        ],
        [
            'phone_code'    =>  '+251',
            'name'          =>  'Ethiopia'
        ],
        [
            'phone_code'    =>  '+500',
            'name'          =>  'Falkland Islands'
        ],
        [
            'phone_code'    =>  '+298',
            'name'          =>  'Faroe Islands'
        ],
        [
            'phone_code'    =>  '+691',
            'name'          =>  'Federated States of Micronesia'
        ],
        [
            'phone_code'    =>  '+679',
            'name'          =>  'Fiji'
        ],
        [
            'phone_code'    =>  '+358',
            'name'          =>  'Finland'
        ],
        [
            'phone_code'    =>  '+33',
            'name'          =>  'France'
        ],
        [
            'phone_code'    =>  '+594',
            'name'          =>  'French Guiana'
        ],
        [
            'phone_code'    =>  '+689',
            'name'          =>  'French Polynesia'
        ],
        [
            'phone_code'    =>  '+241',
            'name'          =>  'Gabon'
        ],
        [
            'phone_code'    =>  '+995',
            'name'          =>  'Georgia'
        ],
        [
            'phone_code'    =>  '+49',
            'name'          =>  'Germany'
        ],
        [
            'phone_code'    =>  '+233',
            'name'          =>  'Ghana'
        ],
        [
            'phone_code'    =>  '+350',
            'name'          =>  'Gibraltar'
        ],
        [
            'phone_code'    =>  '+30',
            'name'          =>  'Greece'
        ],
        [
            'phone_code'    =>  '+299',
            'name'          =>  'Greenland'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Grenada'
        ],
        [
            'phone_code'    =>  '+590',
            'name'          =>  'Guadeloupe'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Guam'
        ],
        [
            'phone_code'    =>  '+502',
            'name'          =>  'Guatemala'
        ],
        [
            'phone_code'    =>  '+44',
            'name'          =>  'Guernsey'
        ],
        [
            'phone_code'    =>  '+224',
            'name'          =>  'Guinea'
        ],
        [
            'phone_code'    =>  '+245',
            'name'          =>  'Guinea-Bissau'
        ],
        [
            'phone_code'    =>  '+592',
            'name'          =>  'Guyana'
        ],
        [
            'phone_code'    =>  '+509',
            'name'          =>  'Haiti'
        ],
        [
            'phone_code'    =>  '+504',
            'name'          =>  'Honduras'
        ],
        [
            'phone_code'    =>  '+852',
            'name'          =>  'Hong Kong'
        ],
        [
            'phone_code'    =>  '+36',
            'name'          =>  'Hungary'
        ],
        [
            'phone_code'    =>  '+354',
            'name'          =>  'Iceland'
        ],
        [
            'phone_code'    =>  '+91',
            'name'          =>  'India'
        ],
        [
            'phone_code'    =>  '+62',
            'name'          =>  'Indonesia'
        ],
        [
            'phone_code'    =>  '+98',
            'name'          =>  'Iran'
        ],
        [
            'phone_code'    =>  '+964',
            'name'          =>  'Iraq'
        ],
        [
            'phone_code'    =>  '+353',
            'name'          =>  'Ireland'
        ],
        [
            'phone_code'    =>  '+44',
            'name'          =>  'Isle Of Man'
        ],
        [
            'phone_code'    =>  '+972',
            'name'          =>  'Israel'
        ],
        [
            'phone_code'    =>  '+39',
            'name'          =>  'Italy'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Jamaica'
        ],
        [
            'phone_code'    =>  '+81',
            'name'          =>  'Japan'
        ],
        [
            'phone_code'    =>  '+44',
            'name'          =>  'Jersey'
        ],
        [
            'phone_code'    =>  '+962',
            'name'          =>  'Jordan'
        ],
        [
            'phone_code'    =>  '+7',
            'name'          =>  'Kazakhstan'
        ],
        [
            'phone_code'    =>  '+254',
            'name'          =>  'Kenya'
        ],
        [
            'phone_code'    =>  '+686',
            'name'          =>  'Kiribati'
        ],
        [
            'phone_code'    =>  '+381',
            'name'          =>  'Kosovo'
        ],
        [
            'phone_code'    =>  '+965',
            'name'          =>  'Kuwait'
        ],
        [
            'phone_code'    =>  '+996',
            'name'          =>  'Kyrgyzstan'
        ],
        [
            'phone_code'    =>  '+856',
            'name'          =>  'Laos'
        ],
        [
            'phone_code'    =>  '+371',
            'name'          =>  'Latvia'
        ],
        [
            'phone_code'    =>  '+961',
            'name'          =>  'Lebanon'
        ],
        [
            'phone_code'    =>  '+266',
            'name'          =>  'Lesotho'
        ],
        [
            'phone_code'    =>  '+231',
            'name'          =>  'Liberia'
        ],
        [
            'phone_code'    =>  '+218',
            'name'          =>  'Libya'
        ],
        [
            'phone_code'    =>  '+423',
            'name'          =>  'Liechtenstein'
        ],
        [
            'phone_code'    =>  '+370',
            'name'          =>  'Lithuania'
        ],
        [
            'phone_code'    =>  '+352',
            'name'          =>  'Luxembourg'
        ],
        [
            'phone_code'    =>  '+853',
            'name'          =>  'Macau'
        ],
        [
            'phone_code'    =>  '+389',
            'name'          =>  'Macedonia'
        ],
        [
            'phone_code'    =>  '+261',
            'name'          =>  'Madagascar'
        ],
        [
            'phone_code'    =>  '+265',
            'name'          =>  'Malawi'
        ],
        [
            'phone_code'    =>  '+60',
            'name'          =>  'Malaysia'
        ],
        [
            'phone_code'    =>  '+960',
            'name'          =>  'Maldives'
        ],
        [
            'phone_code'    =>  '+223',
            'name'          =>  'Mali'
        ],
        [
            'phone_code'    =>  '+356',
            'name'          =>  'Malta'
        ],
        [
            'phone_code'    =>  '+692',
            'name'          =>  'Marshall Islands'
        ],
        [
            'phone_code'    =>  '+596',
            'name'          =>  'Martinique'
        ],
        [
            'phone_code'    =>  '+222',
            'name'          =>  'Mauritania'
        ],
        [
            'phone_code'    =>  '+230',
            'name'          =>  'Mauritius'
        ],
        [
            'phone_code'    =>  '+262',
            'name'          =>  'Mayotte'
        ],
        [
            'phone_code'    =>  '+52',
            'name'          =>  'Mexico'
        ],
        [
            'phone_code'    =>  '+373',
            'name'          =>  'Moldova'
        ],
        [
            'phone_code'    =>  '+377',
            'name'          =>  'Monaco'
        ],
        [
            'phone_code'    =>  '+976',
            'name'          =>  'Mongolia'
        ],
        [
            'phone_code'    =>  '+382',
            'name'          =>  'Montenegro'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Montserrat'
        ],
        [
            'phone_code'    =>  '+212',
            'name'          =>  'Morocco'
        ],
        [
            'phone_code'    =>  '+258',
            'name'          =>  'Mozambique'
        ],
        [
            'phone_code'    =>  '+95',
            'name'          =>  'Myanmar'
        ],
        [
            'phone_code'    =>  '+264',
            'name'          =>  'Namibia'
        ],
        [
            'phone_code'    =>  '+674',
            'name'          =>  'Nauru'
        ],
        [
            'phone_code'    =>  '+977',
            'name'          =>  'Nepal'
        ],
        [
            'phone_code'    =>  '+31',
            'name'          =>  'Netherlands'
        ],
        [
            'phone_code'    =>  '+687',
            'name'          =>  'New Caledonia'
        ],
        [
            'phone_code'    =>  '+64',
            'name'          =>  'New Zealand'
        ],
        [
            'phone_code'    =>  '+505',
            'name'          =>  'Nicaragua'
        ],
        [
            'phone_code'    =>  '+227',
            'name'          =>  'Niger'
        ],
        [
            'phone_code'    =>  '+234',
            'name'          =>  'Nigeria'
        ],
        [
            'phone_code'    =>  '+683',
            'name'          =>  'Niue'
        ],
        [
            'phone_code'    =>  '+672',
            'name'          =>  'Norfolk Island'
        ],
        [
            'phone_code'    =>  '+850',
            'name'          =>  'North Korea'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Northern Mariana Islands'
        ],
        [
            'phone_code'    =>  '+47',
            'name'          =>  'Norway'
        ],
        [
            'phone_code'    =>  '+968',
            'name'          =>  'Oman'
        ],
        [
            'phone_code'    =>  '+92',
            'name'          =>  'Pakistan'
        ],
        [
            'phone_code'    =>  '+680',
            'name'          =>  'Palau'
        ],
        [
            'phone_code'    =>  '+970',
            'name'          =>  'Palestine'
        ],
        [
            'phone_code'    =>  '+507',
            'name'          =>  'Panama'
        ],
        [
            'phone_code'    =>  '+675',
            'name'          =>  'Papua New Guinea'
        ],
        [
            'phone_code'    =>  '+595',
            'name'          =>  'Paraguay'
        ],
        [
            'phone_code'    =>  '+51',
            'name'          =>  'Peru'
        ],
        [
            'phone_code'    =>  '+63',
            'name'          =>  'Philippines'
        ],
        [
            'phone_code'    =>  '+48',
            'name'          =>  'Poland'
        ],
        [
            'phone_code'    =>  '+351',
            'name'          =>  'Portugal'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Puerto Rico'
        ],
        [
            'phone_code'    =>  '+974',
            'name'          =>  'Qatar'
        ],
        [
            'phone_code'    =>  '+242',
            'name'          =>  'Republic of the Congo'
        ],
        [
            'phone_code'    =>  '+262',
            'name'          =>  'Réunion'
        ],
        [
            'phone_code'    =>  '+40',
            'name'          =>  'Romania'
        ],
        [
            'phone_code'    =>  '+7',
            'name'          =>  'Russia'
        ],
        [
            'phone_code'    =>  '+250',
            'name'          =>  'Rwanda'
        ],
        [
            'phone_code'    =>  '+590',
            'name'          =>  'Saint Barthélemy'
        ],
        [
            'phone_code'    =>  '+290',
            'name'          =>  'Saint Helena'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Saint Kitts and Nevis'
        ],
        [
            'phone_code'    =>  '+590',
            'name'          =>  'Saint Martin'
        ],
        [
            'phone_code'    =>  '+508',
            'name'          =>  'Saint Pierre and Miquelon'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Saint Vincent and the Grenadines'
        ],
        [
            'phone_code'    =>  '+685',
            'name'          =>  'Samoa'
        ],
        [
            'phone_code'    =>  '+378',
            'name'          =>  'San Marino'
        ],
        [
            'phone_code'    =>  '+239',
            'name'          =>  'Sao Tome and Principe'
        ],
        [
            'phone_code'    =>  '+966',
            'name'          =>  'Saudi Arabia'
        ],
        [
            'phone_code'    =>  '+221',
            'name'          =>  'Senegal'
        ],
        [
            'phone_code'    =>  '+381',
            'name'          =>  'Serbia'
        ],
        [
            'phone_code'    =>  '+248',
            'name'          =>  'Seychelles'
        ],
        [
            'phone_code'    =>  '+232',
            'name'          =>  'Sierra Leone'
        ],
        [
            'phone_code'    =>  '+65',
            'name'          =>  'Singapore'
        ],
        [
            'phone_code'    =>  '+599',
            'name'          =>  'Sint Maarten'
        ],
        [
            'phone_code'    =>  '+421',
            'name'          =>  'Slovakia'
        ],
        [
            'phone_code'    =>  '+386',
            'name'          =>  'Slovenia'
        ],
        [
            'phone_code'    =>  '+677',
            'name'          =>  'Solomon Islands'
        ],
        [
            'phone_code'    =>  '+252',
            'name'          =>  'Somalia'
        ],
        [
            'phone_code'    =>  '+27',
            'name'          =>  'South Africa'
        ],
        [
            'phone_code'    =>  '+82',
            'name'          =>  'South Korea'
        ],
        [
            'phone_code'    =>  '+211',
            'name'          =>  'South Sudan'
        ],
        [
            'phone_code'    =>  '+34',
            'name'          =>  'Spain'
        ],
        [
            'phone_code'    =>  '+94',
            'name'          =>  'Sri Lanka'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'St. Lucia'
        ],
        [
            'phone_code'    =>  '+249',
            'name'          =>  'Sudan'
        ],
        [
            'phone_code'    =>  '+597',
            'name'          =>  'Suriname'
        ],
        [
            'phone_code'    =>  '+268',
            'name'          =>  'Swaziland'
        ],
        [
            'phone_code'    =>  '+46',
            'name'          =>  'Sweden'
        ],
        [
            'phone_code'    =>  '+41',
            'name'          =>  'Switzerland'
        ],
        [
            'phone_code'    =>  '+963',
            'name'          =>  'Syria'
        ],
        [
            'phone_code'    =>  '+886',
            'name'          =>  'Taiwan'
        ],
        [
            'phone_code'    =>  '+992',
            'name'          =>  'Tajikistan'
        ],
        [
            'phone_code'    =>  '+255',
            'name'          =>  'Tanzania'
        ],
        [
            'phone_code'    =>  '+66',
            'name'          =>  'Thailand'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'The Bahamas'
        ],
        [
            'phone_code'    =>  '+220',
            'name'          =>  'The Gambia'
        ],
        [
            'phone_code'    =>  '+670',
            'name'          =>  'Timor-Leste'
        ],
        [
            'phone_code'    =>  '+228',
            'name'          =>  'Togo'
        ],
        [
            'phone_code'    =>  '+690',
            'name'          =>  'Tokelau'
        ],
        [
            'phone_code'    =>  '+676',
            'name'          =>  'Tonga'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Trinidad and Tobago'
        ],
        [
            'phone_code'    =>  '+216',
            'name'          =>  'Tunisia'
        ],
        [
            'phone_code'    =>  '+90',
            'name'          =>  'Turkey'
        ],
        [
            'phone_code'    =>  '+993',
            'name'          =>  'Turkmenistans'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'Turks and Caicos Islands'
        ],
        [
            'phone_code'    =>  '+688',
            'name'          =>  'Tuvalu'
        ],
        [
            'phone_code'    =>  '+256',
            'name'          =>  'Uganda'
        ],
        [
            'phone_code'    =>  '+380',
            'name'          =>  'Ukraine'
        ],
        [
            'phone_code'    =>  '+971',
            'name'          =>  'United Arab Emirates'
        ],
        [
            'phone_code'    =>  '+44',
            'name'          =>  'United Kingdom'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'United States'
        ],
        [
            'phone_code'    =>  '+598',
            'name'          =>  'Uruguay'
        ],
        [
            'phone_code'    =>  '+1',
            'name'          =>  'US Virgin Islands'
        ],
        [
            'phone_code'    =>  '+998',
            'name'          =>  'Uzbekistan'
        ],
        [
            'phone_code'    =>  '+678',
            'name'          =>  'Vanuatu'
        ],
        [
            'phone_code'    =>  '+39',
            'name'          =>  'Vatican City'
        ],
        [
            'phone_code'    =>  '+58',
            'name'          =>  'Venezuela'
        ],
        [
            'phone_code'    =>  '+84',
            'name'          =>  'Vietnam'
        ],
        [
            'phone_code'    =>  '+681',
            'name'          =>  'Wallis and Futuna'
        ],
        [
            'phone_code'    =>  '+212',
            'name'          =>  'Western Sahara'
        ],
        [
            'phone_code'    =>  '+967',
            'name'          =>  'Yemen'
        ],
        [
            'phone_code'    =>  '+260',
            'name'          =>  'Zambia'
        ],
        [
            'phone_code'    =>  '+263',
            'name'          =>  'Zimbabwe'
        ],
    ];
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('countries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('phone_code');
            $table->string('name');
            #$table->timestamps();
        });

        // Insert some stuff
        DB::table('countries')->insert($this->data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('countries');
    }
}
