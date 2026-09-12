#!/bin/bash
cd /home/z/my-project/public/images
gen() { timeout 300 z-ai image -p "$1" -o "$2" -s 1152x864 && echo "OK $2" || echo "FAIL $2"; }
gen "Indian farmer inspecting diseased tomato crop plants in farm field, agricultural crop disease, documentary photography, warm golden light, high quality, detailed" agriculture-crop.png
gen "Monsoon waterlogged street in Indian town, people wading through flooded road with cycles, documentary photography, overcast light, high quality, detailed" waterlogging.png
gen "Municipal waste segregation color coded bins in Indian neighborhood street, sanitation workers sorting recyclables, documentary photography, morning light, high quality" waste.png
gen "Rural health sub-center in India, community health worker with medical kit examining village patient, documentary photography, warm light, high quality, detailed" healthcare.png
gen "Rural Indian government school classroom, tribal students learning with teacher, chalkboard and books, documentary photography, warm natural window light, high quality" education.png
gen "Damaged eroded muddy rural village road in monsoon India connecting tribal hamlet, documentary photography, overcast light, high quality, detailed" infrastructure-road.png
gen "Plastic waste pollution on Indian river bank, volunteers collecting trash in sacks, documentary photography, natural light, high quality, detailed" river-plastic.png
gen "Solar panel microgrid in Indian tribal village at dusk, rural electrification, warm evening light, documentary photography, high quality, detailed" solar.png
gen "Indian ASHA community health worker visiting pregnant mother in rural village home, maternal care, documentary photography, warm compassionate light, high quality" maternal.png
echo "ALL_DONE_2B"
