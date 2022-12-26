import mongoose from 'mongoose';
import { IColorScheme } from '../interfaces/IColorScheme';

const colorSchemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a full name'],
        index: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    themePrimaryColor: { type: String, default: '#599bb3' }, //background color of items
    themeBoxShadowColor: { type: String, default: '#2d4e5a' }, //box shadow color of items - ColorLuminance('#599bb3',-0.5)
    themeTextShadowColor: { type: String, default: '#3e6d7d' }, //text shadow color of items - ColorLuminance('#599bb3',-0.3)
    themeHoverBackGroundColor: { type: String, default: '#4c8498' }, //button hover color of items and text result color - ColorLuminance('#599bb3',-0.15)
    themeTextWrapperColor: { type: String, default: '#f5f5f5' } //getLightColorFromBg(bot.talkBoxParams.talkboxBackGround);
});

export default mongoose.model<IColorScheme>('ColorScheme', colorSchemeSchema);