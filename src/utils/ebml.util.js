import { Decoder, Reader, tools } from "ts-ebml";

/**
 * @param {Blob} file - File or Blob object.
 * @param {function} callback - Callback function.
 * @example
 * getSeekableBlob(blob or file, callback);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
export function getSeekableBlob(inputBlob, duration, callback) {
  const reader = new Reader();
  const decoder = new Decoder();
  reader.logging = false;
  reader.drop_default_duration = false;

  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const ebmlElms = decoder.decode(this.result);
    for (let element of ebmlElms) {
      reader.read(element);
    }
    reader.stop();
    console.log(reader.duration, reader.metadatas);
    const refinedMetadataBuf = tools.makeMetadataSeekable(reader.metadatas, duration, reader.cues);
    const body = this.result.slice(reader.metadataSize);
    const newBlob = new Blob([refinedMetadataBuf, body], {
      type: inputBlob.type,
    });

    callback(newBlob);
  };
  fileReader.readAsArrayBuffer(inputBlob);
}
