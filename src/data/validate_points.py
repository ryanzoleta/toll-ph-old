import json

with open('points.json') as points_json:
	points = json.load(points_json)
	
all_points = []
duplicates = set()

for point in points['points']:
    point_id = point['id']

    if point_id not in all_points:
        all_points.append(point_id)
    else:
         duplicates.add(point_id)

print('Duplicates:')

for duplicate in duplicates:
    print(f'  {duplicate}')