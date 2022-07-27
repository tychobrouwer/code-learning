from turtle import clear
import requests
import json

pokemonObj = {}
generations = [1, 2, 3]
j = 0
m = 1

for j in generations:
  url = 'https://pokeapi.co/api/v2/generation/' + str(j) + '/'

  resp = requests.get(url=url)
  data = resp.json() # Check the JSON Response Content documentation below

  del data['names']
  del data['version_groups']

  for pokemon in data['pokemon_species']:
    pokemonName = pokemon['name']
    if pokemonName == 'deoxys':
      pokemonName = 'deoxys-normal'
    pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/' + pokemonName + '/'

    print(pokemonName)

    resp = requests.get(url=pokemonUrl)
    status = resp.status_code 

    print(status)
    if status != 404:
      pokemonData = resp.json()

      del pokemonData['sprites']
      del pokemonData['past_types']
      del pokemonData['location_area_encounters']

      pokemonData['species'] = pokemonData['species']['name']

      i = 0

      for i in range(len(pokemonData['game_indices'])):
        if pokemonData['game_indices'][i]['version']['name'] == 'ruby':
          pokemonData['game_index'] = pokemonData['game_indices'][i]['game_index']
          del pokemonData['game_indices']
          break
      
      movesToDelete = []
      for i in range(len(pokemonData['moves'])):
        index = 0
        version_group_detailsToDelete = []
        moveLearnMethods = []

        for k in range(len(pokemonData['moves'][i]['version_group_details'])):
          if pokemonData['moves'][i]['version_group_details'][k]['version_group']['name'] != 'ruby-sapphire':
            version_group_detailsToDelete.append(k)

        version_group_detailsToDelete.sort(reverse=True)
        version_group_detailsToDelete = list(dict.fromkeys(version_group_detailsToDelete))

        for k in version_group_detailsToDelete:
          pokemonData['moves'][i]['version_group_details'].remove(pokemonData['moves'][i]['version_group_details'][k])

        if pokemonData['moves'][i]['version_group_details'] == []: 
          movesToDelete.append(i)

        pokemonData['moves'][i]['move'] = pokemonData['moves'][i]['move']['name']
      movesToDelete.sort(reverse=True)

      for i in movesToDelete:
        del pokemonData['moves'][i]

      for i in range(len(pokemonData['abilities'])):
        pokemonData['abilities'][i]['ability'] = pokemonData['abilities'][i]['ability']['name']

      for i in range(len(pokemonData['stats'])):
        pokemonData['stats'][i]['stat'] = pokemonData['stats'][i]['stat']['name']

      for i in range(len(pokemonData['types'])):
        pokemonData['types'][i]['type'] = pokemonData['types'][i]['type']['name']

      for i in range(len(pokemonData['forms'])):
        pokemonData['forms'][i] = pokemonData['forms'][i]['name']
        
      for i in range(len(pokemonData['moves'])):
        for k in range(len(pokemonData['moves'][i]['version_group_details'])):
          del pokemonData['moves'][i]['version_group_details'][k]['version_group']
          pokemonData['moves'][i]['version_group_details'][k]['move_learn_method'] = pokemonData['moves'][i]['version_group_details'][k]['move_learn_method']['name']
      
      for i in range(len(pokemonData['held_items'])):
        pokemonData['held_items'][i]['item'] = pokemonData['held_items'][i]['item']['name']

        for k in range(len(pokemonData['held_items'][i]['version_details'])):
          if pokemonData['held_items'][i]['version_details'][k]['version']['name'] == 'ruby':
            pokemonData['held_items'][i]['rarity'] = pokemonData['held_items'][i]['version_details'][k]['rarity']

        del pokemonData['held_items'][i]['version_details']

      if pokemonData['name'] == 'deoxys-normal':
        pokemonData['name'] = 'deoxys'

      pokemonObj[pokemonData['id']] = pokemonData

      json_string = json.dumps(pokemonObj)

      with open('pokemon_index.json', 'w') as outfile:
        outfile.write(json_string)
