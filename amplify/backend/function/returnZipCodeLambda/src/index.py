import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def handler(event, context):
    client = boto3.resource('dynamodb',
                            region_name='us-east-2',
                            aws_access_key_id='AKIAZRL7G2ULEQKNXHP6',
                            aws_secret_access_key='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'
                            )

    table = client.Table('masterPreds8')

    data = table.query(
        KeyConditionExpression=Key('GEOID').eq("1067030200.0")
    )
    # print(data['Items'][0])
    # print(type(data['Items'][0]))
    # data = client.get_item(
    # TableName='masterPreds8',
    # Key = {
    #     'GEOID' : {
    #         'S' : '36005008600.0'
    #     }
    # }
    # )

    # print("TYPES TEST TWO")
    # print(event['body'])
    # # print(json.loads(event['body']))
    returnedArray = []
    print("json.load object")
    jsonobject = json.loads(json.loads(event['body']))
    print(jsonobject)
    print(type(jsonobject))
    for i in jsonobject:
        print(i)
        print(type(i))
        data = table.query(
            KeyConditionExpression=Key('GEOID').eq(i["GeoID"])
        )
        try:
            priceInfo = data['Items'][0]
            i["schoolCurrentRent"] = str(
                round(float(priceInfo["rent2019"]), 2))
            i["schoolPredRent"] = str(round(float(priceInfo["rent2020"]), 2))
            i["schoolCurrentHouse"] = str(
                round(float(priceInfo["value2019"]), 2))
            i["schoolPredHouse"] = str(round(float(priceInfo["value2020"]), 2))
            returnedArray.append(i)
        except:
            i["schoolCurrentRent"] = "-1"
            i["schoolPredRent"] = "-1"
            i["schoolCurrentHouse"] = "-1"
            i["schoolPredHouse"] = "-1"
            returnedArray.append(i)

    print("RETURNED ARRAY")
    print(returnedArray)


# td = TypeDeserializer()

# deserialized_data= td.deserialize(data)
# print("deserailzed")
# print(deserialized_data)
#{'id': '5000'}

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(returnedArray)
    }
