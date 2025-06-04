#!/bin/bash

# Script to update entity ID generation patterns

# Define entity mappings: filename:prefix:id_field_name
declare -A entities=(
    ["BookingChange.java"]="BC:changeId"
    ["BookingReview.java"]="BR:reviewId"
    ["EquipmentMessage.java"]="EQM:equipmentMessageId"
    ["FaceAuth.java"]="FA:faceAuthId"
    ["MessageDelivery.java"]="MD:deliveryId"
    ["MessageSetting.java"]="MS:settingId"
    ["MessageTemplate.java"]="MT:templateId"
    ["PersonInfo.java"]="PI:personInfoId"
    ["SiteMessage.java"]="SM:siteMessageId"
    ["SiteSchedule.java"]="SS:scheduleId"
    ["TaskVehicle.java"]="TV:taskVehicleId"
    ["TestContent.java"]="TC:contentId"
    ["WeatherRecord.java"]="WR:weatherId"
)

cd /Users/yhan/workspace/carTest/backend/src/main/java/com/carservice/entity

for entity in "${!entities[@]}"; do
    IFS=':' read -r prefix id_field <<< "${entities[$entity]}"
    
    echo "Updating $entity with prefix $prefix and field $id_field"
    
    # Replace the UUID generation pattern
    sed -i '' "s/@GeneratedValue(generator = \"system-uuid\")/@GeneratedValue(generator = \"${entity%.*}-id\")/g" "$entity"
    sed -i '' "s/@GenericGenerator(name = \"system-uuid\", strategy = \"uuid2\")/@GenericGenerator(name = \"${entity%.*}-id\", strategy = \"com.carservice.entity.generator.PrefixedIdGenerator\", parameters = @org.hibernate.annotations.Parameter(name = \"prefix\", value = \"$prefix\"))/g" "$entity"
    
    # Add column annotation if not present
    if ! grep -q "@Column.*$id_field" "$entity"; then
        sed -i '' "s/private String $id_field;/@Column(name = \"${id_field/Id/_id}\", unique = true)\n    private String $id_field;/g" "$entity"
    fi
done

echo "Entity updates completed!"
