import os

PP = {}

def splitter(str):
	split_ = str.split(' ')
	return (split_[0], split_[1], ' '.join(split_[2:]))


for file_name in [js for js in os.listdir("./") if js.endswith(".js")]:
	f = open(file_name, 'r')
	comment = False
	for line in f:
		if '/**' in line:
			comment = True
			continue
		elif '**/' in line:
			comment = False
			continue
		if comment:
			name, data = line.split(':')
			name = name.strip()
			data = data.strip()
			if name == 'name':
				print data
			elif name == 'desc':
				print data
			elif name == 'arg':
				print splitter(data)
			elif name == 'return':
				print splitter(data)
	f.close()