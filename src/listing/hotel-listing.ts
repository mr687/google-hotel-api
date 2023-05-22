import { create as createXml } from 'xmlbuilder2'
import { ExpandObject, XMLBuilderCreateOptions } from 'xmlbuilder2/lib/interfaces'

interface ListingOptions {
  /**
   * The language in which your feed is written. Set the value of this element to a two-letter language code. For example, `en` for English.
   */
  language: string
  /**
   * This element specifies the geodetic datum or reference model for the latitude/longitude coordinates provided in the feed. If no datum value is provided, the default value for this element is WGS84, which is used by most modern GPS devices. The Tokyo datum is only applicable to addresses in Japan.
   * The valid values for this element are:
   *
   * - WGS84
   * - wgs84
   * - TOKYO
   * - tokyo
   *
   * Note: To use the default value of `WGS84`, don't include the <datum> element in the hotel list.
   * @default WGS84
   * @see https://developers.google.com/hotels/hotel-prices/xml-reference/hotel-list-feed#listings-children
   */
  datum?: string
  /**
   * One or more entries that describe each hotel in the feed. Note that each hotel in the list must have an `ID` that is unique to your site, and that this `ID` should never be re-used.
   * @see https://developers.google.com/hotels/hotel-prices/xml-reference/hotel-list-feed#listings-children
   */
  listing: HotelListing[]
}

interface HotelListing {
  /**
   * A unique identifier for the hotel.
   */
  id: string
  /**
   * The name of the hotel.
   * @example Belgrave House
   */
  name: string
  /**
	 * The full physical location of the hotel.
		This element takes a single attribute, format, which you must set to simple.
		At a minimum, you must provide the street address, city, state/region, and postal code for the hotel. Use <component> child elements to describe each of the following parts of the address:
		- `addr1`: The primary street address of the hotel.
		- `addr2`: The secondary street address, if necessary.
		- `addr3`: A third portion of the street address, if necessary.
		- `city`: The name of the hotel's city.
		- `province`: The name of the hotel's state, region, or province.
		- `postal_code`: The hotel's postal code.
	 *
	 * Alternatively, you can provide a "free-form" address, although this is not recommended. For example:
	 	`123 Main St, Anytown, CA 12345`
	 *
	 * Note that P.O. boxes or other mailing-only addresses are not considered full physical addresses.
	 * @see https://developers.google.com/hotels/hotel-prices/xml-reference/hotel-list-feed#listing-children
	 */
  address: SimpleListingAddr | string
  /**
   * The country that this listing is located in. The value must be an {@link https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 ISO 3116 uppercase 2-letter country code}. For example, United States is `"US"` and Canada is `"CA"`.
   */
  country: string
  /** The latitude that corresponds to the location of the listing. */
  latitude: number
  /** The longitude that corresponds to the location of the listing. */
  longitude: number
  /** Precision of the location of the property sent in meters when the property latitude and longitude is obfuscated. Zero (0) means there is no obfuscation and that it is the exact location.
   *
   * **Note**: This element applies to Vacation Rentals only.
   */
  location_precision?: number
  /**
	 * One or more contact numbers for the hotel. If the listing is business branch, please provide the phone number specific to branch location (not the phone number of central headquarters).

		The **type** attribute can be one of the following:

		- `fax`: Fax telephone number.
		- `main`: Main voice telephone number.
		- `mobile`: Mobile telephone number.
		- `tdd`: Telecommunications Device for the Deaf (TDD) telephone number.
		- `tollfree`: Toll free telephone number.

		@example
		```xml
		<!-- Singapore (country code +65) -->
		<phone type="main">+65 6722-2323</phone>
		<!-- U.S. (country code +1) -->
		<phone type="fax">+1 408-555-1111</phone>
		```
	 * @see https://developers.google.com/hotels/hotel-prices/xml-reference/hotel-list-feed#listing-children
	 */
  phone: ListingPhone
  /** The type of property, such as a hotel. Partners may use whatever internal categories they have to describe their property, such as "business hotels," "resorts," "motels," and similar. */
  category?: string
  /** Optional details used for the listing, such as a description, ratings, and features of the property. */
  content?: ListingContent
}

interface ListingContent {
  description?: ContentDesc
  reviews?: ContentReview[]
  attributes?: ContentAttrs
  image?: ContentImage & {
    /** This tag contains the valid and up-to-date URL of the page on your site that the relevant image is on. It doesn't contain the URL for the image itself. */
    link: string
    /** This tag contains the title of the image. */
    title: string
    /** The name of the author of the content. The value can either be a user name or a full name in the format "Firstname Lastname." */
    author?: string
    /** This tag identifies the date that the content item was created. You must enter a year, month, and day. */
    date: ContentDate
  }
}

interface ContentImage {
  /**
	 * An image must be one of the following:
		- `ad` if the image is an advertisement
		- `menu` if the image is a restaurant menu
		- `photo` if the image is a photo of the business
	 */
  type: 'ad' | 'menu' | 'photo'
  /** The URL of the full-sized image. Use the url attribute to specify the image to use on that page. */
  url: string
  /** Width of the image, in pixels (greater than 720 pixels is recommended) */
  width: number
  /** Height of the image, in pixels (greater than 720 pixels is recommended) */
  height: number
}

interface ContentAttrs {
  website?: string
  /**
   * @see https://developers.google.com/hotels/hotel-prices/xml-reference/hotel-list-feed#attribute-names
   */
  attrs?: Array<{
    name: any
    value: any
  }>
}

interface ContentDesc {
  link?: string
  title?: string
  author?: string
  body: string
  date?: ContentDate
}

interface ContentDate {
  year: string
  month: string
  day: string
}

interface ContentEditorialReview {
  type: 'editorial'
  /** The title of the review. */
  title?: string
}

interface ContentUserReview {
  type: 'user'
  /**
	 * The date of the review, which you specify with the following attributes of this element:
		day: The day of the month; for example, "3".
		month: The month, where 1 = January. For example, "12".
		year: The four-digit year; for example, "2018".
		For example, June 7th, 2017 is written as:

		@example
		<date month="6" day="7" year="2017"/>
	 */
  date?: ContentDate
  /**
	 * The date the reviewer visited the listing being reviewed. The format is the same as <date> above.
		For example, June 7th, 2017 is written as:

		@example
		<servicedate month="6" day="7" year="2017"/>
	 */
  servicedate?: ContentDate
}

type ContentReview = (ContentEditorialReview | ContentUserReview) & {
  /** A link to the review. Include the "http://" or "https://" in this element. */
  link?: string
  /** The review's author; for example, "Susan von Trapp". This can also be the name of a website or publication in which the review appears if it is uncredited. */
  author?: string
  /** A floating point number from 0 to 10 (inclusive) representing the score of the review. For example, "8.9". */
  rating?: string
  /** The text of the review. This element should not contain HTML. */
  body?: string
}

interface SimpleListingAddr {
  format: 'simple'
  /** One or more address components. */
  component: SimpleAddressComp[]
}

interface SimpleAddressComp {
  name: 'addr1' | 'addr2' | 'addr3' | 'city' | 'province' | 'postal_code'
  /** The address component value. */
  value: string
}

interface ListingPhone {
  type: 'fax' | 'main' | 'mobile' | 'tdd' | 'tollfree'
  /** The phone number, including the country code. */
  value: string
}

interface HotelListingCreator {
  addHotel: (hotel: HotelListing) => HotelListingCreator
  writeFile: (path: string) => Promise<void>
  writeString: () => string
}

/** Creates a new hotel listing XML document. */
export function createHotelListing(options: Omit<ListingOptions, 'listing'>): HotelListingCreator {
  const { language, datum } = options

  const xmlOptions: XMLBuilderCreateOptions = { version: '1.0', encoding: 'UTF-8' }
  const xmlContent: ExpandObject = {
    listings: {
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:noNamespaceSchemaLocation': 'http://www.gstatic.com/localfeed/local_feed.xsd',
      language: language || 'en',
      datum: datum,
      listing: [],
    },
  }

  const addDateContent = (date?: ContentDate) => {
    if (!date) {
      return date
    }
    return {
      '@year': date.year,
      '@month': date.month,
      '@day': date.day,
    }
  }

  const addContentIfAny = <T, R = any>(_?: T, addObj?: (_: T) => R): R => {
    if (!_ || !addObj) {
      return undefined as R
    }
    return addObj(_)
  }

  const addHotel = (hotel: HotelListing) => {
    const { id, name, address, country, latitude, longitude, phone, category, content, location_precision } = hotel
    const optionalContent = addContentIfAny(content, item => ({
      text: addContentIfAny(item.description, _ => ({
        '@type': 'description',
        link: _.link,
        title: _.title,
        author: _.author,
        body: _.body,
        date: addDateContent(_.date),
      })),
      review: item.reviews?.map(_ => ({
        '@type': _.type,
        link: _.link,
        title: _.type === 'editorial' ? _.title : undefined,
        author: _.author,
        rating: _.rating,
        body: _.body,
        date: addDateContent(_.type === 'user' ? _.date : undefined),
        servicedate: addDateContent(_.type === 'user' ? _.servicedate : undefined),
      })),
      attributes: {
        website: item.attributes?.website,
        client_attr: item.attributes?.attrs?.map(_ => ({
          '@name': _.name,
          '#text': _.value,
        })),
      },
      image: addContentIfAny(item.image, _ => ({
        '@type': _.type,
        '@url': _.url,
        '@width': _.width,
        '@height': _.height,
        link: _.link,
        title: _.title,
        author: _.author,
        date: addDateContent(_.date),
      })),
    }))
    const hotelXmlContent = {
      id,
      name,
      address:
        typeof address === 'string'
          ? address
          : {
              '@format': address.format,
              component: address.component.map(comp => ({
                '@name': comp.name,
                '#text': comp.value,
              })),
            },
      country: (country || 'US').toUpperCase(),
      latitude,
      longitude,
      location_precision,
      phone: {
        '@type': phone.type,
        '#text': phone.value,
      },
      category,
      content: optionalContent,
    }

    xmlContent.listings.listing.push(hotelXmlContent)
    return thisFn
  }

  const writeString = (): string => {
    if (xmlContent.listings.listing.length === 0) {
      throw new Error('No hotels added')
    }

    return createXml(xmlContent, xmlOptions).end({ prettyPrint: true })
  }

  const writeFile = async (path: string) => {
    if (!path) {
      throw new Error('No path provided')
    }
    if (xmlContent.listings.listing.length === 0) {
      throw new Error('No hotels added')
    }

    const { writeFile } = await import('fs/promises')

    const xmlString = writeString()
    return writeFile(path, xmlString, { encoding: 'utf-8' })
  }

  const thisFn = {
    addHotel,
    writeFile,
    writeString,
  }

  return thisFn
}
