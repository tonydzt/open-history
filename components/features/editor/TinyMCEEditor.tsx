import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { upload } from '@vercel/blob/client';

// 定义TinyMCE编辑器实例的类型
interface TinyMCEEditorInstance {
  getContent: () => string;
  setContent: (content: string) => void;
}

// 定义组件 props 类型
interface EditorClientProps {
  initialValue?: string;
  onChange?: (content: string) => void;
}

const EditorClient = forwardRef<TinyMCEEditorInstance, EditorClientProps>(
  ({ initialValue = "" }, ref) => {
    const editorRef = useRef<TinyMCEEditorInstance | null>(null);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (editorRef.current) {
          return editorRef.current.getContent();
        }
        return "";
      },
      setContent: (content: string) => {
        if (editorRef.current) {
          editorRef.current.setContent(content);
        }
      },
    }));

    return (
      <>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={initialValue || ""}
          // 移除onEditorChange，防止光标位置重置
          // tong注释：基础设置参考https://www.tiny.cloud/docs/tinymce/latest/basic-setup/
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "preview",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "image | media | link | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }" +
              ".tox-statusbar__branding {display: none !important;}",
            // tong注释：参考https://www.tiny.cloud/docs/tinymce/latest/file-image-upload/#automatic_uploads
            automatic_uploads: true,
            // tong注释：参考https://www.tiny.cloud/docs/tinymce/latest/copy-and-paste/#paste_data_images
            paste_data_images: true,
            images_upload_handler: async (blobInfo, progress) => {
              try {
                // 准备上传参数
                const file = blobInfo.blob();
                const updatedPayload = {
                  fileName: blobInfo.filename()
                };

                // 使用 Vercel Blob 客户端上传文件
                const newBlob = await upload(blobInfo.filename(), file, {
                  access: 'public',
                  handleUploadUrl: '/api/storage/upload-image',
                  clientPayload: JSON.stringify(updatedPayload),
                  onUploadProgress: (event) => {
                    let progressPercentage = 0;
                    try {
                      if (event && typeof event === 'object') {
                        const loaded = (event as any).loaded || 0;
                        const total = (event as any).total || 1;
                        progressPercentage = Math.round((loaded / total) * 100);
                      }
                    } catch (error) {
                      console.warn('无法计算上传进度:', error);
                    }
                    progress(progressPercentage);
                  }
                });

                // 上传成功，返回图片 URL
                return newBlob.url;
              } catch (error) {
                console.error('图片上传失败:', error);
                throw new Error('图片上传失败');
              }
            },
            file_picker_callback: function (callback, value, meta) {
              if (meta.filetype === "image") {
                var input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.onchange = function () {
                  var file = (this as HTMLInputElement).files?.[0];
                  var reader = new FileReader();
                  reader.onload = function () {
                    var id = "blobid" + new Date().getTime();
                    // @ts-ignore
                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = (reader.result as string).split(",")[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
                    callback(blobInfo.blobUri(), { title: file?.name || "" });
                  };
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }
            },
          }}
        />
      </>
    );
  },
);

export default EditorClient;
